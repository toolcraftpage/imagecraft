import { useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  ArrowLeft,
  Brush,
  Crop,
  Filter,
  Image as ImageIcon,
  Layers3,
  Minus,
  Palette,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
  Square,
  Sticker,
  Type,
  Wand2,
} from 'lucide-react';

export default function EditorPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [activePreset, setActivePreset] = useState('None');

  const adjustments = [
    { label: 'Brightness', value: 100 },
    { label: 'Contrast', value: 100 },
    { label: 'Saturation', value: 100 },
    { label: 'Hue Rotate', value: 0 },
    { label: 'Sharpness', value: 100 },
    { label: 'Blur', value: 0 },
    { label: 'Vignette', value: 100 },
    { label: 'Opacity', value: 100 },
  ];

  const presetButtons = ['None', 'B&W', 'Cool', 'Fade', 'Dramatic', 'Noir', 'Vivid', 'Sepia', 'Warm', 'Matte', 'Retro', 'Summer'];
  const toolButtons = [
    { icon: Sparkles, label: 'Filter' },
    { icon: Brush, label: 'Draw' },
    { icon: Type, label: 'Text' },
    { icon: Square, label: 'Shapes' },
    { icon: Sticker, label: 'Stickers' },
    { icon: Crop, label: 'Frame' },
    { icon: Wand2, label: 'Crop' },
    { icon: SlidersHorizontal, label: 'Resize' },
    { icon: Palette, label: 'Transform' },
    { icon: Filter, label: 'Corner' },
    { icon: Layers3, label: 'Background' },
    { icon: Sparkles, label: 'Effects' },
  ];

  return (
    <div className="flex h-screen flex-col bg-[#f4f3f8] text-slate-800">
      <Helmet>
        <title>Photo Editor - Free Online Tool</title>
      </Helmet>

      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" style={{ display: 'none' }} />

      <div className="flex items-center justify-between border-b border-slate-200 bg-[#f2f1f7] px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-800 text-[10px] font-bold text-white">?</span>
          <span className="font-medium text-slate-700">imagetools.to</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {toolButtons.map(({ icon: Icon, label }, index) => (
            <button
              key={label + index}
              type="button"
              className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition ${
                index === 0 ? 'border-slate-200 bg-white text-slate-700 shadow-sm' : 'border-transparent bg-transparent text-slate-600 hover:bg-white/80'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button type="button" className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
            Open
          </button>
          <button type="button" className="rounded-lg bg-[#87c66a] px-4 py-2 text-sm font-medium text-white shadow-sm">
            Save
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-[270px] border-r border-slate-200 bg-[#f7f6f9] px-4 py-4">
          <div className="mb-6">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Adjustments</p>
            {adjustments.map((item) => (
              <div key={item.label} className="mb-4">
                <div className="mb-1 flex items-center justify-between text-[12px] text-slate-700">
                  <span>{item.label}</span>
                  <span className="text-slate-500">{item.value}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={200}
                  value={item.value}
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-[#6ec973]"
                  readOnly
                />
              </div>
            ))}
            <button type="button" className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm">
              Reset Adjustments
            </button>
          </div>

          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Presets</p>
            <div className="grid grid-cols-2 gap-2">
              {presetButtons.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setActivePreset(preset)}
                  className={`rounded-md border px-2 py-2 text-sm ${
                    activePreset === preset ? 'border-slate-300 bg-[#eef3f1] text-slate-700' : 'border-slate-200 bg-slate-100 text-slate-700'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <main className="relative flex flex-1 items-center justify-center bg-[#f3f3f6]">
          <div className="absolute inset-0 opacity-60" style={{ backgroundImage: 'radial-gradient(#c8cad2 1px, transparent 1px)', backgroundSize: '12px 12px' }} />

          <div className="relative flex h-[340px] w-[430px] items-center justify-center rounded-[18px] border-[2px] border-dashed border-slate-300 bg-[#f9f9fa] shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
            <div className="flex flex-col items-center justify-center gap-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-300 bg-white text-slate-700 shadow-sm">
                <ImageIcon className="h-9 w-9" />
              </div>

              <div className="text-center">
                <h1 className="text-[28px] font-bold tracking-[-0.04em] text-slate-800">Open an Image</h1>
                <p className="mt-2 text-[14px] text-slate-600">Drop an image here, or click below</p>
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-xl bg-[#8fd06a] px-8 py-3 text-base font-semibold text-white shadow-[0_8px_20px_rgba(143,208,106,0.35)] transition hover:bg-[#7fc65b]"
              >
                Choose File
              </button>
            </div>
          </div>

          <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full border border-slate-200 bg-white/90 px-3 py-2 shadow-md backdrop-blur-sm">
            <button type="button" className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600">
              <Minus className="h-4 w-4" />
            </button>
            <span className="min-w-[72px] text-center text-sm font-medium text-slate-700">100%</span>
            <button type="button" className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600">
              <Plus className="h-4 w-4" />
            </button>
            <button type="button" className="rounded-md bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">
              Fit
            </button>
          </div>
        </main>

        <aside className="w-[220px] border-l border-slate-200 bg-[#f7f6f9] px-4 py-4">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Layers</p>
            <div className="flex items-center gap-2 text-slate-500">
              <button type="button" className="text-lg leading-none">+</button>
              <button type="button" className="text-lg leading-none">?</button>
              <button type="button" className="text-lg leading-none">?</button>
            </div>
          </div>
          <div className="rounded-md border border-slate-200 bg-transparent p-2 text-slate-400">No layers</div>
        </aside>
      </div>

      <div className="flex items-center justify-between border-t border-slate-200 bg-[#f2f1f7] px-4 py-3">
        <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm">
          <Search className="h-4 w-4 text-slate-400" />
          <span className="text-sm text-slate-500">Search</span>
        </div>

        <div className="flex items-center gap-3">
          <button type="button" className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button type="button" className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600">
            <Sparkles className="h-4 w-4" />
          </button>
          <button type="button" className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600">
            <ImageIcon className="h-4 w-4" />
          </button>
          <button type="button" className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600">
            <Type className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span>1:00 AM</span>
          <span>8/19/2026</span>
        </div>
      </div>
    </div>
  );
}
