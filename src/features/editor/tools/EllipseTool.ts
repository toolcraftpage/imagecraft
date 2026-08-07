import { Canvas, Ellipse, IEvent } from 'fabric';
import type { useEditorStore } from '../store/editorStore';

export class EllipseTool {
  private canvas: Canvas;
  private pushHistory: (state: string) => void;
  private getState: () => ReturnType<typeof useEditorStore.getState>;
  private startPoint: { x: number; y: number } | null = null;
  private currentEllipse: Ellipse | null = null;

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
    this.currentEllipse = new Ellipse({
      left: pointer.x,
      top: pointer.y,
      rx: 0,
      ry: 0,
      fill: shapeSettings.fill,
      stroke: shapeSettings.stroke,
      strokeWidth: shapeSettings.strokeWidth,
    });
    this.canvas.add(this.currentEllipse);
  };

  private handleMouseMove = (opt: IEvent) => {
    if (!this.startPoint || !this.currentEllipse) return;
    const pointer = this.canvas.getPointer(opt.e);
    const rx = Math.abs(pointer.x - this.startPoint.x) / 2;
    const ry = Math.abs(pointer.y - this.startPoint.y) / 2;
    this.currentEllipse.set({
      left: Math.min(this.startPoint.x, pointer.x),
      top: Math.min(this.startPoint.y, pointer.y),
      rx,
      ry,
    });
    this.canvas.renderAll();
  };

  private handleMouseUp = () => {
    if (this.currentEllipse && this.currentEllipse.rx! * 2 < 5) {
      this.canvas.remove(this.currentEllipse);
    } else {
      this.pushHistory(JSON.stringify(this.canvas.toJSON()));
    }
    this.startPoint = null;
    this.currentEllipse = null;
  };
}