import { useState } from 'react';
import { Square } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';

export default function FrameTool() {
  const { addTextObject } = useEditorStore();
  const [frameColor, setFrameColor] = useState('#c084fc');
  const [frameWidth, setFrameWidth] = useState(8);

  const addFrame = () => {
    addTextObject({
      type: 'shape',
      name: 'Frame layer',
      shapeType: 'rectangle',
      text: '',
      x: 40,
      y: 40,
      width: 540,
      height: 540,
      rotation: 0,
      fill: 'transparent',
      stroke: frameColor,
      strokeWidth: frameWidth,
      opacity: 100,
      color: frameColor,
      fontFamily: 'Inter, Arial, sans-serif',
      fontSize: 18,
      fontWeight: 600,
      italic: false,
      underline: false,
      textAlign: 'left',
      letterSpacing: 0,
      lineHeight: 1.2,
      visible: true,
      locked: false,
    });
  };

  return (
    <div className="space-y-5 p-5">
      <div className="rounded-xl border border-teal-200/40 bg-gradient-to-br from-teal-50/10 to-cyan-50/10 p-4 shadow-sm">
        <div className="flex items-center gap-3 text-foreground">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500/20 to-cyan-500/20">
            <Square className="h-5 w-5 text-teal-600" />
          </div>
          <span className="text-base font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">Add Frame Border</span>
        </div>
      </div>

      <div className="space-y-4 rounded-xl border border-teal-200/40 bg-gradient-to-br from-teal-50/10 to-cyan-50/10 p-5 shadow-sm">
        <label className="block text-xs font-bold uppercase tracking-[0.14em] text-teal-600">
          Border Color
          <input type="color" value={frameColor} onChange={(event) => setFrameColor(event.target.value)} className="mt-2 h-12 w-full rounded-lg border border-teal-300/40 bg-white p-1 cursor-pointer shadow-sm hover:shadow-md transition" />
        </label>
        <label className="block text-xs font-bold uppercase tracking-[0.14em] text-cyan-600">
          Border Width
          <div className="mt-2">
            <input type="range" min={1} max={30} value={frameWidth} onChange={(event) => setFrameWidth(Number(event.target.value))} className="w-full accent-cyan-500" />
            <span className="mt-1 block text-sm text-cyan-700 font-bold">{frameWidth}px</span>
          </div>
        </label>
      </div>

      <button type="button" onClick={addFrame} className="w-full rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 px-4 py-3 text-sm font-bold text-white transition hover:from-teal-600 hover:to-cyan-700 shadow-lg hover:shadow-xl active:scale-95">
        ➕ Add Frame
      </button>
    </div>
  );
}
