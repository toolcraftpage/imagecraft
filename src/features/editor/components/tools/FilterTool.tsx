import { Sparkles } from 'lucide-react';

interface FilterToolProps {
  brightness?: number;
  contrast?: number;
  saturation?: number;
  hue?: number;
  onBrightnessChange?: (value: number) => void;
  onContrastChange?: (value: number) => void;
  onSaturationChange?: (value: number) => void;
  onHueChange?: (value: number) => void;
}

const presets = [
  { label: 'Warm', brightness: 110, contrast: 118, saturation: 125, hue: 8, color: 'from-orange-500 to-yellow-500' },
  { label: 'Cool', brightness: 105, contrast: 110, saturation: 115, hue: -15, color: 'from-blue-500 to-cyan-500' },
  { label: 'Cinematic', brightness: 95, contrast: 130, saturation: 115, hue: -12, color: 'from-purple-500 to-pink-500' },
];

export default function FilterTool({
  brightness = 100,
  contrast = 100,
  saturation = 100,
  hue = 0,
  onBrightnessChange = () => undefined,
  onContrastChange = () => undefined,
  onSaturationChange = () => undefined,
  onHueChange = () => undefined,
}: FilterToolProps) {
  const controls = [
    { label: 'Brightness', value: brightness, onChange: onBrightnessChange, min: 0, max: 200, color: 'border-yellow-300/40 bg-gradient-to-r from-yellow-500/20 to-yellow-600/10', textColor: 'text-yellow-600', accentColor: 'accent-yellow-500' },
    { label: 'Contrast', value: contrast, onChange: onContrastChange, min: 0, max: 200, color: 'border-orange-300/40 bg-gradient-to-r from-orange-500/20 to-orange-600/10', textColor: 'text-orange-600', accentColor: 'accent-orange-500' },
    { label: 'Saturation', value: saturation, onChange: onSaturationChange, min: 0, max: 200, color: 'border-pink-300/40 bg-gradient-to-r from-pink-500/20 to-pink-600/10', textColor: 'text-pink-600', accentColor: 'accent-pink-500' },
    { label: 'Hue', value: hue, onChange: onHueChange, min: -180, max: 180, color: 'border-purple-300/40 bg-gradient-to-r from-purple-500/20 to-purple-600/10', textColor: 'text-purple-600', accentColor: 'accent-purple-500' },
  ];

  return (
    <div className="space-y-5 p-5">
      <div className="rounded-xl border border-pink-200/40 bg-gradient-to-br from-pink-50/10 to-rose-50/10 p-4 shadow-sm">
        <div className="flex items-center gap-3 text-foreground">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500/20 to-rose-500/20">
            <Sparkles className="h-5 w-5 text-pink-600" />
          </div>
          <span className="text-base font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">Filter Effects</span>
        </div>
      </div>

      <div className="space-y-4 rounded-xl border border-pink-200/40 bg-gradient-to-br from-pink-50/10 to-rose-50/10 p-5 shadow-sm">
        {controls.map((control) => (
          <div key={control.label} className={`space-y-2 rounded-lg border ${control.color} p-3`}>
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.12em]">
              <span className={control.textColor}>{control.label}</span>
              <span className={`${control.textColor} font-bold`}>{Math.round(control.value)}{control.label === 'Hue' ? '°' : '%'}</span>
            </div>
            <input
              type="range"
              min={control.min}
              max={control.max}
              value={control.value}
              onChange={(event) => control.onChange(Number(event.target.value))}
              className={`w-full ${control.accentColor}`}
            />
          </div>
        ))}
      </div>

      <div className="space-y-3 rounded-xl border border-violet-200/40 bg-gradient-to-br from-violet-50/10 to-indigo-50/10 p-5 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">✨ Quick Presets</p>
        <div className="grid grid-cols-3 gap-2">
          {presets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => {
                onBrightnessChange(preset.brightness);
                onContrastChange(preset.contrast);
                onSaturationChange(preset.saturation);
                onHueChange(preset.hue);
              }}
              className={`rounded-xl border bg-gradient-to-r ${preset.color} px-3 py-2.5 text-xs font-bold text-white transition hover:shadow-lg hover:scale-105 active:scale-95 shadow-sm`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
