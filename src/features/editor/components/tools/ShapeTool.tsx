import { useState } from 'react';
import { Shapes } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';

const shapeOptions = [
  { id: 'rectangle', label: 'Rectangle' },
  { id: 'circle', label: 'Circle' },
  { id: 'line', label: 'Line' },
  { id: 'arrow', label: 'Arrow' },
] as const;

export default function ShapeTool() {
  const { addTextObject } = useEditorStore();
  const [shapeType, setShapeType] = useState<(typeof shapeOptions)[number]['id']>('rectangle');
  const [fill, setFill] = useState('#7c3aed');
  const [stroke, setStroke] = useState('#1f2937');
  const [strokeWidth, setStrokeWidth] = useState(3);

  const addShape = () => {
    addTextObject({
      type: 'shape',
      name: `${shapeType} layer`,
      shapeType,
      text: '',
      x: 120,
      y: 140,
      width: shapeType === 'line' || shapeType === 'arrow' ? 220 : 180,
      height: shapeType === 'line' || shapeType === 'arrow' ? 16 : 120,
      fill: shapeType === 'line' || shapeType === 'arrow' ? 'transparent' : fill,
      stroke,
      strokeWidth,
      opacity: 100,
      color: stroke,
      rotation: 0,
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
    <div className="space-y-4 p-5">
      <div className="rounded-xl border border-indigo-200/40 bg-gradient-to-br from-indigo-50/10 to-purple-50/10 p-4 shadow-sm">
        <div className="flex items-center gap-3 text-foreground">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
            <Shapes className="h-5 w-5 text-indigo-600" />
          </div>
          <span className="text-base font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Add Shapes</span>
        </div>
      </div>

      <div className="space-y-3 rounded-xl border border-indigo-200/40 bg-gradient-to-br from-indigo-50/10 to-purple-50/10 p-4 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">Choose shape</p>
        <div className="grid grid-cols-2 gap-2">
          {shapeOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setShapeType(option.id)}
              className={`rounded-lg border px-3 py-2.5 text-sm font-semibold transition ${shapeType === option.id ? 'border-indigo-400/60 bg-gradient-to-r from-indigo-500/20 to-purple-600/10 text-indigo-700 shadow-sm' : 'border-indigo-200/30 bg-white/40 text-foreground-secondary hover:border-indigo-300/50 hover:bg-indigo-50/40'}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3 rounded-xl border border-orange-200/40 bg-gradient-to-br from-orange-50/10 to-red-50/10 p-4 shadow-sm">
        <label className="block text-xs font-bold uppercase tracking-[0.14em] text-orange-600">
          Fill Color
          <input type="color" value={fill} onChange={(event) => setFill(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-orange-300/40 bg-white p-1 cursor-pointer shadow-sm hover:shadow-md transition" />
        </label>
        <label className="block text-xs font-bold uppercase tracking-[0.14em] text-orange-600">
          Stroke Color
          <input type="color" value={stroke} onChange={(event) => setStroke(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-orange-300/40 bg-white p-1 cursor-pointer shadow-sm hover:shadow-md transition" />
        </label>
        <label className="block text-xs font-bold uppercase tracking-[0.14em] text-orange-600">
          Stroke width
          <div className="mt-2">
            <input type="range" min={1} max={20} value={strokeWidth} onChange={(event) => setStrokeWidth(Number(event.target.value))} className="w-full accent-orange-500" />
            <span className="mt-1 block text-xs text-orange-600 font-bold">{strokeWidth}px</span>
          </div>
        </label>
      </div>

      <button type="button" onClick={addShape} className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-3 text-sm font-bold text-white transition hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-xl active:scale-95">
        Add shape layer
      </button>
    </div>
  );
}
