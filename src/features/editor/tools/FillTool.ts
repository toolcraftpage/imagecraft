import { Canvas, IEvent } from 'fabric';
import type { useEditorStore } from '../store/editorStore';

export class FillTool {
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
    this.canvas.on('mouse:down', this.handleMouseDown);
  }

  deactivate() {
    this.canvas.off('mouse:down', this.handleMouseDown);
  }

  private handleMouseDown = (opt: IEvent) => {
    const activeObj = this.canvas.getActiveObject();
    if (activeObj) {
      const { brushSettings } = this.getState();
      activeObj.set('fill', brushSettings.color);
      this.canvas.renderAll();
      this.pushHistory(JSON.stringify(this.canvas.toJSON()));
    }
  };
}