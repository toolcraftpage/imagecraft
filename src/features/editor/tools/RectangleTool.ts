import { Canvas, Rect, IEvent } from 'fabric';
import type { useEditorStore } from '../store/editorStore';

export class RectangleTool {
  private canvas: Canvas;
  private pushHistory: (state: string) => void;
  private getState: () => ReturnType<typeof useEditorStore.getState>;
  private startPoint: { x: number; y: number } | null = null;
  private currentRect: Rect | null = null;

  constructor(
    canvas: Canvas,
    pushHistory: (state: string) => void,
    getState: () => ReturnType<typeof useEditorStore.getState>,
    setActiveTool: (tool: string) => void,
  ) {
    this.canvas = canvas;
    this.pushHistory = pushHistory;
    this.getState = getState;
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
    const { shapeSettings } = this.getState();
    this.currentRect = new Rect({
      left: pointer.x,
      top: pointer.y,
      width: 0,
      height: 0,
      fill: shapeSettings.fill,
      stroke: shapeSettings.stroke,
      strokeWidth: shapeSettings.strokeWidth,
    });
    this.canvas.add(this.currentRect);
  };

  private handleMouseMove = (opt: IEvent) => {
    if (!this.startPoint || !this.currentRect) return;
    const pointer = this.canvas.getPointer(opt.e);
    const left = Math.min(this.startPoint.x, pointer.x);
    const top = Math.min(this.startPoint.y, pointer.y);
    this.currentRect.set({
      left,
      top,
      width: Math.abs(pointer.x - this.startPoint.x),
      height: Math.abs(pointer.y - this.startPoint.y),
    });
    this.canvas.renderAll();
  };

  private handleMouseUp = () => {
    if (this.currentRect && this.currentRect.width! < 5 && this.currentRect.height! < 5) {
      this.canvas.remove(this.currentRect);
    } else {
      this.pushHistory(JSON.stringify(this.canvas.toJSON()));
    }
    this.startPoint = null;
    this.currentRect = null;
  };
}