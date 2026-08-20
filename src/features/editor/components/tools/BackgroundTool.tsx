import { Wand2 } from 'lucide-react';

interface BackgroundToolProps {
  bgTolerance?: number;
  bgSoftness?: number;
  isProcessing?: boolean;
  onBgToleranceChange?: (value: number) => void;
  onBgSoftnessChange?: (value: number) => void;
  onApplyBackgroundRemoval?: () => void;
}

export default function BackgroundTool({
  bgTolerance = 42,
  bgSoftness = 2,
  isProcessing = false,
  onBgToleranceChange = () => undefined,
  onBgSoftnessChange = () => undefined,
  onApplyBackgroundRemoval = () => undefined,
}: BackgroundToolProps) {
  return (
    <div className="space-y-5 p-5">
      <div className="rounded-xl border border-orange-200/40 bg-gradient-to-br from-orange-50/10 to-red-50/10 p-4 shadow-sm">
        <div className="flex items-center gap-3 text-foreground">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500/20 to-red-500/20">
            <Wand2 className="h-5 w-5 text-orange-600" />
          </div>
          <span className="text-base font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Background Removal</span>
        </div>
      </div>

      <div className="space-y-4 rounded-xl border border-red-200/40 bg-gradient-to-br from-red-50/10 to-orange-50/10 p-5 shadow-sm">
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.12em]">
              <span className="text-red-600">Sensitivity</span>
              <span className="text-red-700 font-bold">{bgTolerance}</span>
            </div>
            <div className="relative">
              <input type="range" min={0} max={100} step={1} value={bgTolerance} onChange={(event) => onBgToleranceChange(Number(event.target.value))} className="w-full accent-red-500" aria-label="Background sensitivity" />
              <div className="mt-1 flex gap-2 text-xs">
                <span className="text-red-600/70">Low</span>
                <span className="flex-1"></span>
                <span className="text-red-600/70">High</span>
              </div>
            </div>
            <p className="text-xs text-red-600/70 italic">Adjust how strict the background detection is</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.12em]">
              <span className="text-orange-600">Softness</span>
              <span className="text-orange-700 font-bold">{bgSoftness}</span>
            </div>
            <div className="relative">
              <input type="range" min={0} max={20} step={1} value={bgSoftness} onChange={(event) => onBgSoftnessChange(Number(event.target.value))} className="w-full accent-orange-500" aria-label="Background softness" />
              <div className="mt-1 flex gap-2 text-xs">
                <span className="text-orange-600/70">Crisp</span>
                <span className="flex-1"></span>
                <span className="text-orange-600/70">Smooth</span>
              </div>
            </div>
            <p className="text-xs text-orange-600/70 italic">Make edges smooth or crisp</p>
          </div>
        </div>

        <button type="button" disabled={isProcessing} onClick={onApplyBackgroundRemoval} className="w-full rounded-xl bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 px-4 py-3.5 text-sm font-bold text-white transition hover:from-orange-600 hover:via-red-600 hover:to-orange-700 shadow-lg hover:shadow-xl active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:shadow-lg">
          {isProcessing ? '⏳ Processing...' : '✨ Remove Background'}
        </button>
      </div>

      <div className="rounded-xl border border-green-200/40 bg-gradient-to-br from-green-50/10 to-emerald-50/10 p-4">
        <p className="text-xs text-center text-green-700 font-semibold">💡 Tip: Start with low sensitivity for better results</p>
      </div>
    </div>
  );
}
