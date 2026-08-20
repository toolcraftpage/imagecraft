import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';

export default function CornersTool() {
  const { selectedObject, textObjects, updateTextObject } = useEditorStore();
  const [radius, setRadius] = useState(24);

  const selected = selectedObject ? textObjects.find((item) => item.id === selectedObject) ?? null : null;

  const applyRadius = (nextRadius: number) => {
    if (!selected) return;
    updateTextObject(selected.id, { cornerRadius: nextRadius });
  };

  return (
    <div className="space-y-5 p-5">
      <div className="rounded-xl border border-yellow-200/40 bg-gradient-to-br from-yellow-50/10 to-amber-50/10 p-4 shadow-sm">
        <div className="flex items-center gap-3 text-foreground">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-500/20 to-amber-500/20">
            <Sparkles className="h-5 w-5 text-yellow-600" />
          </div>
          <span className="text-base font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">Corner Radius</span>
        </div>
      </div>

      <div className="space-y-4 rounded-xl border border-yellow-200/40 bg-gradient-to-br from-yellow-50/10 to-amber-50/10 p-5 shadow-sm">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.12em]">
          <span className="text-yellow-600">Radius Value</span>
          <span className="text-yellow-700 font-bold text-lg">{radius}px</span>
        </div>
        <input type="range" min={0} max={80} value={radius} onChange={(event) => {
          const nextRadius = Number(event.target.value);
          setRadius(nextRadius);
          applyRadius(nextRadius);
        }} className="w-full accent-yellow-500" />
        <div className="flex gap-2 text-xs text-yellow-600/70">
          <span>Sharp</span>
          <span className="flex-1"></span>
          <span>Smooth</span>
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-orange-300/40 bg-gradient-to-br from-orange-50/20 to-red-50/20 p-5 text-sm text-orange-700 shadow-sm">
        <p className="font-semibold mb-1">💡 How to use:</p>
        <p className="text-xs text-orange-600/70">Select a shape or layer, then adjust the radius to round its corners smoothly.</p>
      </div>
    </div>
  );
}
