import { Canvas, IEvent } from 'fabric';
import type { useEditorStore } from '../store/editorStore';

export class EyedropperTool {
  private canvas: Canvas;
  private pushHistory: (state: string) => void;
  private getState: () => ReturnType<typeof useEditorStore.getState>;
  private setActiveTool: (tool: string) => void;

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
    this.canvas.on('mouse:down', this.handleMouseDown);
  }

  deactivate() {
    this.canvas.off('mouse:down', this.handleMouseDown);
  }

  private handleMouseDown = (opt: IEvent) => {
    const e = opt.e as MouseEvent;
    const ctx = this.canvas.getContext();
    const pixel = ctx.getImageData(e.offsetX, e.offsetY, 1, 1).data;
    const hex = `#${pixel[0].toString(16).padStart(2, '0')}${pixel[1].toString(16).padStart(2, '0')}${pixel[2].toString(16).padStart(2, '0')}`;
    this.getState().setBrushSettings({ color: hex });
    this.setActiveTool('select'); // switch to select after picking
  };
}