import { Canvas } from 'fabric';
import type { useEditorStore } from '../store/editorStore';

export class PanTool {
  private canvas: Canvas;
  private isPanning = false;
  private lastX = 0;
  private lastY = 0;
  private pushHistory: (state: string) => void;
  private getState: () => ReturnType<typeof useEditorStore.getState>;

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
    this.canvas.defaultCursor = 'move';
    this.canvas.on('mouse:down', this.handleMouseDown);
    this.canvas.on('mouse:move', this.handleMouseMove);
    this.canvas.on('mouse:up', this.handleMouseUp);
  }

  deactivate() {
    this.canvas.off('mouse:down', this.handleMouseDown);
    this.canvas.off('mouse:move', this.handleMouseMove);
    this.canvas.off('mouse:up', this.handleMouseUp);
  }

  private handleMouseDown = (opt: fabric.IEvent) => {
    const e = opt.e as MouseEvent;
    this.isPanning = true;
    this.lastX = e.clientX;
    this.lastY = e.clientY;
    this.canvas.selection = false;
    e.preventDefault();
  };

  private handleMouseMove = (opt: fabric.IEvent) => {
    if (!this.isPanning) return;
    const e = opt.e as MouseEvent;
    const vpt = this.canvas.viewportTransform!;
    vpt[4] += e.clientX - this.lastX;
    vpt[5] += e.clientY - this.lastY;
    this.lastX = e.clientX;
    this.lastY = e.clientY;
    this.canvas.requestRenderAll();
  };

  private handleMouseUp = () => {
    this.isPanning = false;
  };
}