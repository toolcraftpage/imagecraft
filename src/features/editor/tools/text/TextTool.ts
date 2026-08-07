import { IText, Canvas as FabricCanvas, IEvent } from 'fabric';
import type { TextSettings } from '../../store/toolSettingsStore';

export class TextTool {
  private canvas: FabricCanvas | null = null;
  private settings: TextSettings;
  private onHistorySaved: () => void;

  constructor(settings: TextSettings, onHistorySaved: () => void) {
    this.settings = settings;
    this.onHistorySaved = onHistorySaved;
  }

  activate(canvas: FabricCanvas) {
    this.canvas = canvas;
    canvas.isDrawingMode = false;
    canvas.selection = false;
    canvas.defaultCursor = 'text';
    canvas.off('mouse:down', this.onMouseDown);
    canvas.on('mouse:down', this.onMouseDown);
  }

  deactivate() {
    if (!this.canvas) return;
    this.canvas.off('mouse:down', this.onMouseDown);
    this.canvas = null;
  }

  updateSettings(settings: Partial<TextSettings>) {
    Object.assign(this.settings, settings);
  }

  private onMouseDown = (opt: IEvent) => {
    if (!this.canvas) return;
    const pointer = this.canvas.getPointer(opt.e);
    const text = new IText('Type here', {
      left: pointer.x,
      top: pointer.y,
      fontFamily: this.settings.fontFamily,
      fontSize: this.settings.fontSize,
      fill: this.settings.color,
      fontWeight: this.settings.bold ? 'bold' : 'normal',
      fontStyle: this.settings.italic ? 'italic' : 'normal',
      underline: this.settings.underline,
      textAlign: this.settings.textAlign,
    });
    this.canvas.add(text);
    this.canvas.setActiveObject(text);
    text.enterEditing();
    text.on('editing:exited', () => this.onHistorySaved());
  };
}