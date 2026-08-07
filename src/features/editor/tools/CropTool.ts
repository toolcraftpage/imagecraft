import { Canvas, Rect, IEvent } from 'fabric';
import type { useEditorStore } from '../store/editorStore';

export class CropTool {
  private canvas: Canvas;
  private pushHistory: (state: string) => void;
  private getState: () => ReturnType<typeof useEditorStore.getState>;
  private setActiveTool: (tool: string) => void;
  private startPoint: { x: number; y: number } | null = null;
  private cropRect: Rect | null = null;

  constructor(
    canvas: Canvas,
    pushHistory: (state: string) => void,
    getState: () => ReturnType<typeof useEditorStore.getState>,
    setActiveTool: (tool: string) => void,
  ) {
    this.canvas = canvas;
    this.pushHistory = pushHistory;
    this.getState = getState;
    this.setActiveTool = setActiveTool;
  }

  activate() {
    this.canvas.isDrawingMode = false;
    this.canvas.selection = false;
    this.canvas.defaultCursor = 'crosshair';
    this.canvas.on('mouse:down', this.handleMouseDown);
    this.canvas.on('mouse:move', this.handleMouseMove);
    this.canvas.on('mouse:up', this.handleMouseUp);
  }

  deactivate() {
    this.canvas.off('mouse:down', this.handleMouseDown);
    this.canvas.off('mouse:move', this.handleMouseMove);
    this.canvas.off('mouse:up', this.handleMouseUp);
  }

  private handleMouseDown = (opt: IEvent) => {
    const pointer = this.canvas.getPointer(opt.e);
    this.startPoint = { x: pointer.x, y: pointer.y };
    if (this.cropRect) this.canvas.remove(this.cropRect);
    this.cropRect = new Rect({
      left: pointer.x,
      top: pointer.y,
      width: 0,
      height: 0,
      fill: 'rgba(0,0,0,0.3)',
      stroke: '#fff',
      strokeWidth: 2,
      selectable: false,
      evented: false,
    });
    this.canvas.add(this.cropRect);
    this.canvas.renderAll();
  };

  private handleMouseMove = (opt: IEvent) => {
    if (!this.startPoint || !this.cropRect) return;
    const pointer = this.canvas.getPointer(opt.e);
    this.cropRect.set({
      left: Math.min(this.startPoint.x, pointer.x),
      top: Math.min(this.startPoint.y, pointer.y),
      width: Math.abs(pointer.x - this.startPoint.x),
      height: Math.abs(pointer.y - this.startPoint.y),
    });
    this.canvas.renderAll();
  };

  private handleMouseUp = () => {
    if (!this.cropRect || !this.startPoint) return;
    const cr = this.cropRect;
    if (cr.width! > 10 && cr.height! > 10) {
      const cropData = { left: cr.left!, top: cr.top!, width: cr.width!, height: cr.height! };
      this.canvas.remove(cr);
      this.cropRect = null;
      this.canvas.getObjects().forEach((obj) => {
        obj.set({ left: obj.left! - cropData.left, top: obj.top! - cropData.top });
      });
      this.canvas.setWidth(cropData.width);
      this.canvas.setHeight(cropData.height);
      this.canvas.renderAll();
      this.pushHistory(JSON.stringify(this.canvas.toJSON()));
      this.setActiveTool('select');
    }
    this.startPoint = null;
  };
}