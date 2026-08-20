import { Crop, RotateCcw, X, Check } from 'lucide-react';

export type CropAspect = 'free' | '1:1' | '4:3' | '3:2' | '16:9' | 'original';

export interface CropRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface CropToolProps {
  crop: CropRect | null;
  aspect: CropAspect;
  onAspectChange: (aspect: CropAspect) => void;
  onWidthChange: (value: number) => void;
  onHeightChange: (value: number) => void;
  onCancel: () => void;
  onApply: () => void;
  onResetAspect: () => void;
}

const aspectOptions: CropAspect[] = ['free', '1:1', '4:3', '3:2', '16:9', 'original'];

export default function CropTool({
  crop,
  aspect,
  onAspectChange,
  onWidthChange,
  onHeightChange,
  onCancel,
  onApply,
  onResetAspect,
}: CropToolProps) {
  const currentWidth = crop?.width ?? 0;
  const currentHeight = crop?.height ?? 0;

  return (
    <div className="space-y-5 p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
            <Crop className="h-5 w-5 text-cyan-600" />
          </div>
          <p className="text-base font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">Crop Image</p>
        </div>
      </div>

      <div className="space-y-3 rounded-xl border border-cyan-200/40 bg-gradient-to-br from-cyan-50/10 to-blue-50/10 p-4 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-600/80">Aspect Ratio</p>
        <div className="grid grid-cols-3 gap-2">
          {aspectOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onAspectChange(option)}
              className={`rounded-lg border px-2.5 py-2.5 text-xs font-semibold transition ${
                aspect === option
                  ? 'border-cyan-400/60 bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 text-cyan-700 shadow-sm'
                  : 'border-cyan-200/30 bg-white/40 text-foreground-secondary hover:bg-cyan-50/40 hover:border-cyan-300/50'
              }`}
            >
              {option === 'free' ? 'Free' : option === 'original' ? 'Original' : option}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-xs font-bold uppercase tracking-[0.12em] text-slate-600">
            Width (px)
            <input
              type="number"
              min={1}
              value={Math.round(currentWidth)}
              onChange={(event) => onWidthChange(Number(event.target.value))}
              className="mt-2 w-full rounded-lg border border-blue-200/40 bg-gradient-to-r from-blue-50/30 to-cyan-50/30 px-3 py-2.5 text-sm font-medium text-foreground outline-none focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/20 transition"
            />
          </label>

          <label className="block text-xs font-bold uppercase tracking-[0.12em] text-slate-600">
            Height (px)
            <input
              type="number"
              min={1}
              value={Math.round(currentHeight)}
              onChange={(event) => onHeightChange(Number(event.target.value))}
              className="mt-2 w-full rounded-lg border border-blue-200/40 bg-gradient-to-r from-blue-50/30 to-cyan-50/30 px-3 py-2.5 text-sm font-medium text-foreground outline-none focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/20 transition"
            />
          </label>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onResetAspect}
          className="flex-1 rounded-lg border border-slate-300/40 bg-gradient-to-r from-slate-50/50 to-slate-100/30 px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-400/50 hover:bg-slate-100/50 shadow-sm"
        >
          <span className="inline-flex items-center justify-center gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset
          </span>
        </button>
      </div>

      <div className="flex gap-2 border-t border-border/30 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-200/40 bg-gradient-to-r from-red-50/40 to-red-100/20 px-3 py-2.5 text-sm font-medium text-red-700 transition hover:border-red-300/60 hover:from-red-50/60 hover:to-red-100/40 shadow-sm"
        >
          <X className="h-4 w-4" />
          Cancel
        </button>
        <button
          type="button"
          onClick={onApply}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 px-3 py-2.5 text-sm font-bold text-white transition hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl active:scale-95"
        >
          <Check className="h-4 w-4" />
          Apply
        </button>
      </div>
    </div>
  );
}
