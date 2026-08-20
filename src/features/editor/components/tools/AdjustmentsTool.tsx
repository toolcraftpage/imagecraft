import { SlidersHorizontal, RotateCcw, RotateCw, FlipHorizontal, FlipVertical, Wand2 } from 'lucide-react';

interface AdjustmentsToolProps {
  brightness?: number;
  contrast?: number;
  saturation?: number;
  hue?: number;
  bgTolerance?: number;
  bgSoftness?: number;
  isProcessing?: boolean;
  onBrightnessChange?: (value: number) => void;
  onContrastChange?: (value: number) => void;
  onSaturationChange?: (value: number) => void;
  onHueChange?: (value: number) => void;
  onBgToleranceChange?: (value: number) => void;
  onBgSoftnessChange?: (value: number) => void;
  onResetAdjustment?: () => void;
  onResetAll?: () => void;
  onApplyBackgroundRemoval?: () => void;
  onRotateLeft?: () => void;
  onRotateRight?: () => void;
  onFlipHorizontal?: () => void;
  onFlipVertical?: () => void;
}

export default function AdjustmentsTool({
  brightness = 100,
  contrast = 100,
  saturation = 100,
  hue = 0,
  bgTolerance = 42,
  bgSoftness = 2,
  isProcessing = false,
  onBrightnessChange = () => undefined,
  onContrastChange = () => undefined,
  onSaturationChange = () => undefined,
  onHueChange = () => undefined,
  onBgToleranceChange = () => undefined,
  onBgSoftnessChange = () => undefined,
  onResetAdjustment = () => undefined,
  onResetAll = () => undefined,
  onApplyBackgroundRemoval = () => undefined,
  onRotateLeft = () => undefined,
  onRotateRight = () => undefined,
  onFlipHorizontal = () => undefined,
  onFlipVertical = () => undefined,
}: AdjustmentsToolProps) {
  const controls = [
    { label: 'Brightness', value: brightness, min: 0, max: 200, step: 1, onChange: onBrightnessChange },
    { label: 'Contrast', value: contrast, min: 0, max: 200, step: 1, onChange: onContrastChange },
    { label: 'Saturation', value: saturation, min: 0, max: 200, step: 1, onChange: onSaturationChange },
    { label: 'Hue', value: hue, min: -180, max: 180, step: 1, onChange: onHueChange },
  ];

  return (
    <div className="space-y-5 p-5">
      <div className="space-y-4 rounded-xl border border-blue-200/40 bg-gradient-to-br from-blue-50/10 to-cyan-50/10 p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-foreground">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
              <SlidersHorizontal className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-base font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Adjustments</span>
          </div>
          <button type="button" onClick={onResetAll} className="rounded-lg border border-blue-300/40 bg-gradient-to-r from-blue-50/50 to-cyan-50/30 p-2 text-blue-600 hover:border-blue-400/60" aria-label="Reset adjustments">
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>

        {controls.map((control, idx) => {
          const colors = ['from-yellow-500/20 to-yellow-600/10', 'from-orange-500/20 to-orange-600/10', 'from-pink-500/20 to-pink-600/10', 'from-purple-500/20 to-purple-600/10'];
          const borderColors = ['border-yellow-300/40', 'border-orange-300/40', 'border-pink-300/40', 'border-purple-300/40'];
          const textColors = ['text-yellow-600', 'text-orange-600', 'text-pink-600', 'text-purple-600'];
          const accentColors = ['accent-yellow-500', 'accent-orange-500', 'accent-pink-500', 'accent-purple-500'];
          
          return (
            <div key={control.label} className={`space-y-2 rounded-lg border ${borderColors[idx]} bg-gradient-to-r ${colors[idx]} p-3`}>
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.12em]">
                <span className={textColors[idx]}>{control.label}</span>
                <div className="flex items-center gap-2">
                  <span className={`font-bold ${textColors[idx]}`}>{Math.round(control.value)}{control.label === 'Hue' ? '°' : '%'}</span>
                  <button type="button" onClick={onResetAdjustment} className={`rounded-md border ${borderColors[idx]} bg-white/40 p-1 ${textColors[idx]} hover:bg-white/60`} aria-label={`Reset ${control.label}`}>
                    <RotateCcw className="h-3 w-3" />
                  </button>
                </div>
              </div>
              <input type="range" min={control.min} max={control.max} step={control.step} value={control.value} onChange={(event) => control.onChange(Number(event.target.value))} className={`w-full ${accentColors[idx]}`} aria-label={control.label} />
            </div>
          );
        })}
      </div>

      <div className="space-y-3 rounded-xl border border-green-200/40 bg-gradient-to-br from-green-50/10 to-emerald-50/10 p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20">
            <span className="text-sm font-bold">🔄</span>
          </div>
          <span className="text-base font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Transform</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={onRotateLeft} className="group flex items-center justify-center gap-2 rounded-lg border border-blue-300/40 bg-gradient-to-r from-blue-500/10 to-blue-600/10 px-3 py-2.5 text-sm font-medium text-blue-700 transition hover:border-blue-400/60 hover:from-blue-500/20 hover:to-blue-600/20"><RotateCcw className="h-4 w-4 transition group-hover:scale-110" /> Left</button>
          <button type="button" onClick={onRotateRight} className="group flex items-center justify-center gap-2 rounded-lg border border-purple-300/40 bg-gradient-to-r from-purple-500/10 to-purple-600/10 px-3 py-2.5 text-sm font-medium text-purple-700 transition hover:border-purple-400/60 hover:from-purple-500/20 hover:to-purple-600/20"><RotateCw className="h-4 w-4 transition group-hover:scale-110" /> Right</button>
          <button type="button" onClick={onFlipHorizontal} className="group flex items-center justify-center gap-2 rounded-lg border border-green-300/40 bg-gradient-to-r from-green-500/10 to-green-600/10 px-3 py-2.5 text-sm font-medium text-green-700 transition hover:border-green-400/60 hover:from-green-500/20 hover:to-green-600/20"><FlipHorizontal className="h-4 w-4 transition group-hover:scale-110" /> Flip X</button>
          <button type="button" onClick={onFlipVertical} className="group flex items-center justify-center gap-2 rounded-lg border border-orange-300/40 bg-gradient-to-r from-orange-500/10 to-orange-600/10 px-3 py-2.5 text-sm font-medium text-orange-700 transition hover:border-orange-400/60 hover:from-orange-500/20 hover:to-orange-600/20"><FlipVertical className="h-4 w-4 transition group-hover:scale-110" /> Flip Y</button>
        </div>
      </div>

      <div className="space-y-3 rounded-xl border border-fuchsia-200/40 bg-gradient-to-br from-fuchsia-50/10 to-pink-50/10 p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-fuchsia-500/20 to-pink-500/20">
            <Wand2 className="h-5 w-5 text-fuchsia-600" />
          </div>
          <span className="text-base font-bold bg-gradient-to-r from-fuchsia-600 to-pink-600 bg-clip-text text-transparent">Background Removal</span>
        </div>
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.12em] text-fuchsia-600">
              <span>Sensitivity</span>
              <span className="text-fuchsia-700">{bgTolerance}</span>
            </div>
            <input type="range" min={0} max={100} step={1} value={bgTolerance} onChange={(event) => onBgToleranceChange(Number(event.target.value))} className="w-full accent-fuchsia-500" aria-label="Background sensitivity" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.12em] text-fuchsia-600">
              <span>Softness</span>
              <span className="text-fuchsia-700">{bgSoftness}</span>
            </div>
            <input type="range" min={0} max={20} step={1} value={bgSoftness} onChange={(event) => onBgSoftnessChange(Number(event.target.value))} className="w-full accent-pink-500" aria-label="Background softness" />
          </div>
        </div>
        <button type="button" disabled={isProcessing} onClick={onApplyBackgroundRemoval} className="w-full rounded-lg bg-gradient-to-r from-fuchsia-500 to-pink-600 px-4 py-3 text-sm font-bold text-white transition hover:from-fuchsia-600 hover:to-pink-700 shadow-lg hover:shadow-xl active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:shadow-lg">
          {isProcessing ? '🔄 Removing background...' : '✨ Apply Background Removal'}
        </button>
      </div>
    </div>
  );
}
