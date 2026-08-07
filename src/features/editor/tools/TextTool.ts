import { Canvas, IText, IEvent } from 'fabric';
import type { useEditorStore } from '../store/editorStore';

export class TextTool {
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
    this.canvas.selection = false;
    this.canvas.defaultCursor = 'text';
    this.canvas.on('mouse:down', this.handleMouseDown);
  }

  deactivate() {
    this.canvas.off('mouse:down', this.handleMouseDown);
  }

  private handleMouseDown = (opt: IEvent) => {
    const pointer = this.canvas.getPointer(opt.e);
    const { textSettings } = this.getState();
    const text = new IText('Type here', {
      left: pointer.x,
      top: pointer.y,
      fontFamily: textSettings.fontFamily,
      fontSize: textSettings.fontSize,
      fill: textSettings.color,
    });
    this.canvas.add(text);
    this.canvas.setActiveObject(text);
    text.enterEditing();
    text.on('editing:exited', () => this.pushHistory(JSON.stringify(this.canvas.toJSON())));
  };
}