import { RotateCcw, RotateCw, FlipHorizontal, FlipVertical, Wand2 } from 'lucide-react';

interface AdjustmentControl {
  label: string;
  key: 'brightness' | 'contrast' | 'saturation' | 'hue';
  min: number;
  max: number;
  step: number;
  value: number;
  suffix?: string;
  formatter?: (value: number) => string;
}

interface AdjustmentsPanelProps {
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

const creation = {
  brightness: { label: 'Brightness', min: 0, max: 200, step: 1, value: 100, suffix: '%' },
  contrast: { label: 'Contrast', min: 0, max: 200, step: 1, value: 100, suffix: '%' },
  saturation: { label: 'Saturation', min: 0, max: 200, step: 1, value: 100, suffix: '%' },
  hue: { label: 'Hue', min: -180, max: 180, step: 1, value: 0, suffix: '°' },
};

export default function AdjustmentsPanel({
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
}: AdjustmentsPanelProps) {
  const controls: AdjustmentControl[] = [
    { ...creation.brightness, key: 'brightness', value: brightness, formatter: (value) => `${Math.round(value)}%` },
    { ...creation.contrast, key: 'contrast', value: contrast, formatter: (value) => `${Math.round(value)}%` },
    { ...creation.saturation, key: 'saturation', value: saturation, formatter: (value) => `${Math.round(value)}%` },
    { ...creation.hue, key: 'hue', value: hue, formatter: (value) => `${Math.round(value)}°` },
  ];

  return (
    <div className="space-y-5 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">Adjustments</p>
        <button
          type="button"
          onClick={onResetAll}
          title="Reset all adjustments"
          className="rounded-lg p-1.5 text-foreground-secondary transition hover:bg-surface-elevated hover:text-foreground"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-4">
        {controls.map((control) => (
          <div key={control.key} className="space-y-2 rounded-xl border border-border bg-surface-muted/60 p-3">
            <div className="flex items-center justify-between gap-2">
              <label className="text-sm font-medium text-foreground">{control.label}</label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-foreground-secondary">{control.formatter?.(control.value) ?? `${control.value}${control.suffix ?? ''}`}</span>
                <button
                  type="button"
                  onClick={onResetAdjustment}
                  className="rounded-md p-1 text-foreground-muted transition hover:bg-surface-elevated hover:text-foreground"
                  title={`Reset ${control.label}`}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <input
              type="range"
              min={control.min}
              max={control.max}
              step={control.step}
              value={control.value}
              onChange={(event) => {
                const nextValue = Number(event.target.value);
                if (control.key === 'brightness') onBrightnessChange(nextValue);
                if (control.key === 'contrast') onContrastChange(nextValue);
                if (control.key === 'saturation') onSaturationChange(nextValue);
                if (control.key === 'hue') onHueChange(nextValue);
              }}
              className="w-full accent-accent"
              aria-label={control.label}
            />
          </div>
        ))}
      </div>

      <div className="space-y-3 rounded-xl border border-border bg-surface-muted/60 p-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-foreground">Transform</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={onRotateLeft} title="Rotate left" aria-label="Rotate left" className="flex items-center justify-center gap-2 rounded-lg border border-border bg-surface px-2 py-2 text-sm text-foreground transition hover:bg-surface-elevated">
            <RotateCcw className="h-4 w-4" />
            Left
          </button>
          <button type="button" onClick={onRotateRight} title="Rotate right" aria-label="Rotate right" className="flex items-center justify-center gap-2 rounded-lg border border-border bg-surface px-2 py-2 text-sm text-foreground transition hover:bg-surface-elevated">
            <RotateCw className="h-4 w-4" />
            Right
          </button>
          <button type="button" onClick={onFlipHorizontal} title="Flip horizontal" aria-label="Flip horizontal" className="flex items-center justify-center gap-2 rounded-lg border border-border bg-surface px-2 py-2 text-sm text-foreground transition hover:bg-surface-elevated">
            <FlipHorizontal className="h-4 w-4" />
            Flip X
          </button>
          <button type="button" onClick={onFlipVertical} title="Flip vertical" aria-label="Flip vertical" className="flex items-center justify-center gap-2 rounded-lg border border-border bg-surface px-2 py-2 text-sm text-foreground transition hover:bg-surface-elevated">
            <FlipVertical className="h-4 w-4" />
            Flip Y
          </button>
        </div>
      </div>

      <div className="space-y-3 rounded-xl border border-border bg-surface-muted/60 p-3">
        <div className="flex items-center items-center justify-between">
          <p className="text-sm font-medium text-foreground">Background Removal</p>
          <Wand2 className="h-4 w-4 text-foreground-muted" />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm text-foreground-secondary">Sensitivity</label>
            <span className="text-sm text-foreground">{bgTolerance}</span>
          </div>
          <input type="range" min="0" max="100" step="1" value={bgTolerance} onChange={(event) => onBgToleranceChange(Number(event.target.value))} className="w-full accent-accent" aria-label="Background sensitivity" />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm text-foreground-secondary">Softness</label>
            <span className="text-sm text-foreground">{bgSoftness}</span>
          </div>
          <input type="range" min="0" max="20" step="1" value={bgSoftness} onChange={(event) => onBgSoftnessChange(Number(event.target.value))} className="w-full accent-accent" aria-label="Background softness" />
        </div>

        <button
          type="button"
          onClick={onApplyBackgroundRemoval}
          disabled={isProcessing}
          className="w-full rounded-lg bg-accent px-3 py-2 text-sm font-medium text-white transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isProcessing ? 'Removing background...' : 'Apply Background Removal'}
        </button>
      </div>
    </div>
  );
}
