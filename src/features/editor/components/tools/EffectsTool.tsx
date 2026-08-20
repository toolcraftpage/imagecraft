import { Sparkles } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';

const effects = [
  { id: 'none', label: 'None' },
  { id: 'glow', label: 'Glow' },
  { id: 'vignette', label: 'Vignette' },
  { id: 'sepia', label: 'Sepia' },
] as const;

export default function EffectsTool() {
  const { selectedObject, textObjects, updateTextObject } = useEditorStore();
  const selected = selectedObject ? textObjects.find((item) => item.id === selectedObject) ?? null : null;

  const applyEffect = (effect: (typeof effects)[number]['id']) => {
    if (!selected) return;
    updateTextObject(selected.id, { effect });
  };

  return (
    <div className="space-y-5 p-5">
      <div className="rounded-xl border border-fuchsia-200/40 bg-gradient-to-br from-fuchsia-50/10 to-purple-50/10 p-4 shadow-sm">
        <div className="flex items-center gap-3 text-foreground">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-fuchsia-500/20 to-purple-500/20">
            <Sparkles className="h-5 w-5 text-fuchsia-600" />
          </div>
          <span className="text-base font-bold bg-gradient-to-r from-fuchsia-600 to-purple-600 bg-clip-text text-transparent">Visual Effects</span>
        </div>
      </div>

      <div className="space-y-2 rounded-xl border border-fuchsia-200/40 bg-gradient-to-br from-fuchsia-50/10 to-purple-50/10 p-5 shadow-sm">
        {effects.map((effect, idx) => {
          const colors = ['text-slate-600', 'text-orange-600', 'text-amber-600', 'text-yellow-600'];
          const bgColors = ['from-slate-50/40 to-slate-50/20', 'from-orange-50/40 to-orange-50/20', 'from-amber-50/40 to-amber-50/20', 'from-yellow-50/40 to-yellow-50/20'];
          const borderColors = ['border-slate-300/40', 'border-orange-300/40', 'border-amber-300/40', 'border-yellow-300/40'];
          
          return (
            <button
              key={effect.id}
              type="button"
              onClick={() => applyEffect(effect.id)}
              className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 text-sm font-bold transition hover:scale-105 active:scale-95 ${selected?.effect === effect.id ? `${borderColors[idx]} bg-gradient-to-r ${bgColors[idx]} ${colors[idx]} ring-2 ring-offset-1` : `${borderColors[idx]} bg-gradient-to-r ${bgColors[idx]} ${colors[idx]} hover:from-opacity-60`}`}
            >
              <span className="font-bold">{effect.label}</span>
              <span className={`text-xs font-bold px-2 py-1 rounded ${selected?.effect === effect.id ? 'bg-green-500/30 text-green-700' : 'bg-slate-300/30 text-slate-600'}`}>{selected?.effect === effect.id ? '✓ Active' : 'Off'}</span>
            </button>
          );
        })}
      </div>

      <div className="rounded-xl border border-blue-300/40 bg-gradient-to-br from-blue-50/20 to-cyan-50/20 p-4">
        <p className="text-xs text-center text-blue-700 font-semibold">💡 Select a text layer to apply effects</p>
      </div>
    </div>
  );
}
