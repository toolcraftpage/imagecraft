import { useState } from 'react';
import { Palette } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';

export default function WatermarkTool() {
  const { addTextObject } = useEditorStore();
  const [text, setText] = useState('ImageCraft');
  const [color, setColor] = useState('#ffffff');

  const addWatermark = () => {
    addTextObject({
      type: 'text',
      name: 'Watermark',
      text,
      x: 220,
      y: 230,
      width: 260,
      height: 70,
      rotation: -18,
      color,
      fill: color,
      stroke: '#000000',
      strokeWidth: 0,
      opacity: 55,
      fontFamily: 'Arial, sans-serif',
      fontSize: 36,
      fontWeight: 700,
      italic: false,
      underline: false,
      textAlign: 'center',
      letterSpacing: 0,
      lineHeight: 1,
      visible: true,
      locked: false,
    });
  };

  return (
    <div className="space-y-5 p-5">
      <div className="rounded-xl border border-indigo-200/40 bg-gradient-to-br from-indigo-50/10 to-purple-50/10 p-4 shadow-sm">
        <div className="flex items-center gap-3 text-foreground">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
            <Palette className="h-5 w-5 text-indigo-600" />
          </div>
          <span className="text-base font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Add Watermark</span>
        </div>
      </div>

      <div className="space-y-4 rounded-xl border border-indigo-200/40 bg-gradient-to-br from-indigo-50/10 to-purple-50/10 p-5 shadow-sm">
        <label className="block text-xs font-bold uppercase tracking-[0.14em] text-indigo-600">
          Watermark Text
          <input 
            value={text} 
            onChange={(event) => setText(event.target.value)} 
            className="mt-2 w-full rounded-xl border border-indigo-200/40 bg-gradient-to-r from-indigo-50/30 to-purple-50/30 px-3 py-2.5 text-sm font-medium text-foreground outline-none focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/20 transition" 
            placeholder="ImageCraft"
          />
        </label>
        <label className="block text-xs font-bold uppercase tracking-[0.14em] text-purple-600">
          Watermark Color
          <input 
            type="color" 
            value={color} 
            onChange={(event) => setColor(event.target.value)} 
            className="mt-2 h-12 w-full rounded-lg border border-purple-300/40 bg-white p-1 cursor-pointer shadow-sm hover:shadow-md transition" 
          />
        </label>
      </div>

      <button type="button" onClick={addWatermark} className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-3 text-sm font-bold text-white transition hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-xl active:scale-95">
        🔐 Add Watermark
      </button>

      <div className="rounded-xl border border-green-300/40 bg-gradient-to-br from-green-50/20 to-emerald-50/20 p-4">
        <p className="text-xs text-center text-green-700 font-semibold">✓ Protect your images with a visible watermark</p>
      </div>
    </div>
  );
}
