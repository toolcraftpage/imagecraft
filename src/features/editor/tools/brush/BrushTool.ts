import { Canvas, PencilBrush } from 'fabric';
import type { useEditorStore } from '../store/editorStore';

export class BrushTool {
  private canvas: Canvas;
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
    const { brushSettings } = this.getState();
    this.canvas.isDrawingMode = true;
    this.canvas.freeDrawingBrush = new PencilBrush(this.canvas);
    this.canvas.freeDrawingBrush.width = brushSettings.size;
    this.canvas.freeDrawingBrush.color = brushSettings.color;
    this.canvas.selection = false;
    this.canvas.on('path:created', this.handlePathCreated);
  }

  deactivate() {
    this.canvas.isDrawingMode = false;
    this.canvas.off('path:created', this.handlePathCreated);
  }

  private handlePathCreated = () => {
    this.pushHistory(JSON.stringify(this.canvas.toJSON()));
  };
}