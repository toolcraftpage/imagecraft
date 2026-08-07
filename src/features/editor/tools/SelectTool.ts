import { Canvas } from 'fabric';
import type { useEditorStore } from '../store/editorStore';

export class SelectTool {
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
    this.canvas.isDrawingMode = false;
    this.canvas.selection = true;
    this.canvas.defaultCursor = 'default';
  }

  deactivate() {}
}