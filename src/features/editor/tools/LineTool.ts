import { Canvas, Line, IEvent } from 'fabric';
import type { useEditorStore } from '../store/editorStore';

export class LineTool {
  private canvas: Canvas;
  private pushHistory: (state: string) => void;
  private getState: () => ReturnType<typeof useEditorStore.getState>;
  private startPoint: { x: number; y: number } | null = null;
  private currentLine: Line | null = null;

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
    this.currentLine = new Line([pointer.x, pointer.y, pointer.x, pointer.y], {
      stroke: shapeSettings.stroke,
      strokeWidth: shapeSettings.strokeWidth,
    });
    this.canvas.add(this.currentLine);
  };

  private handleMouseMove = (opt: IEvent) => {
    if (!this.startPoint || !this.currentLine) return;
    const pointer = this.canvas.getPointer(opt.e);
    this.currentLine.set({ x2: pointer.x, y2: pointer.y });
    this.canvas.renderAll();
  };

  private handleMouseUp = () => {
    if (
      this.currentLine &&
      Math.abs(this.currentLine.x2! - this.currentLine.x1!) < 5 &&
      Math.abs(this.currentLine.y2! - this.currentLine.y1!) < 5
    ) {
      this.canvas.remove(this.currentLine);
    } else {
      this.pushHistory(JSON.stringify(this.canvas.toJSON()));
    }
    this.startPoint = null;
    this.currentLine = null;
  };
}