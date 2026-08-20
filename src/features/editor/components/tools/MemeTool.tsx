import { useState } from 'react';
import { BadgeCheck } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';

export default function MemeTool() {
  const { addTextObject } = useEditorStore();
  const [top, setTop] = useState('WHEN THE');
  const [bottom, setBottom] = useState('BUILD ACTUALLY WORKS');

  const addMemeText = (text: string, y: number) => {
    addTextObject({
      type: 'text',
      name: 'Meme text',
      text,
      x: 70,
      y,
      width: 480,
      height: 80,
      rotation: 0,
      color: '#ffffff',
      fill: '#ffffff',
      stroke: '#000000',
      strokeWidth: 4,
      opacity: 100,
      fontFamily: 'Arial Black, sans-serif',
      fontSize: 42,
      fontWeight: 800,
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
      <div className="rounded-xl border border-red-200/40 bg-gradient-to-br from-red-50/10 to-pink-50/10 p-4 shadow-sm">
        <div className="flex items-center gap-3 text-foreground">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-red-500/20 to-pink-500/20">
            <BadgeCheck className="h-5 w-5 text-red-600" />
          </div>
          <span className="text-base font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">Meme Generator</span>
        </div>
      </div>

      <div className="space-y-4 rounded-xl border border-red-200/40 bg-gradient-to-br from-red-50/10 to-pink-50/10 p-5 shadow-sm">
        <label className="block text-xs font-bold uppercase tracking-[0.14em] text-red-600">
          Top Text
          <input 
            value={top} 
            onChange={(event) => setTop(event.target.value)} 
            className="mt-2 w-full rounded-xl border border-red-200/40 bg-gradient-to-r from-red-50/30 to-pink-50/30 px-3 py-2.5 text-sm font-bold text-foreground outline-none focus:border-red-400/60 focus:ring-2 focus:ring-red-500/20 transition uppercase" 
            placeholder="WHEN THE"
          />
        </label>
        <label className="block text-xs font-bold uppercase tracking-[0.14em] text-pink-600">
          Bottom Text
          <input 
            value={bottom} 
            onChange={(event) => setBottom(event.target.value)} 
            className="mt-2 w-full rounded-xl border border-pink-200/40 bg-gradient-to-r from-pink-50/30 to-red-50/30 px-3 py-2.5 text-sm font-bold text-foreground outline-none focus:border-pink-400/60 focus:ring-2 focus:ring-pink-500/20 transition uppercase" 
            placeholder="BUILD WORKS"
          />
        </label>
      </div>

      <button type="button" onClick={() => { addMemeText(top, 40); addMemeText(bottom, 420); }} className="w-full rounded-xl bg-gradient-to-r from-red-500 to-pink-600 px-4 py-3 text-sm font-bold text-white transition hover:from-red-600 hover:to-pink-700 shadow-lg hover:shadow-xl active:scale-95">
        🎬 Add Meme Text
      </button>

      <div className="rounded-xl border border-yellow-300/40 bg-gradient-to-br from-yellow-50/20 to-amber-50/20 p-4">
        <p className="text-xs text-center text-yellow-700 font-semibold">💁 Classic meme format with bold impact text</p>
      </div>
    </div>
  );
}
