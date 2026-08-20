import { Type, Minus, Plus, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';

const fontOptions = ['Inter, Arial, sans-serif', 'Arial, sans-serif', 'Georgia, serif', 'Verdana, sans-serif'];
const weights = [400, 500, 600, 700, 800];

export default function TextTool() {
  const {
    textObjects,
    selectedObject,
    updateTextObject,
  } = useEditorStore();

  const textObject = selectedObject ? textObjects.find((item) => item.id === selectedObject && item.type === 'text') ?? null : null;

  const updateValue = <K extends keyof NonNullable<typeof textObject>>(key: K, value: NonNullable<typeof textObject>[K]) => {
    if (!textObject) return;
    updateTextObject(textObject.id, { [key]: value } as Partial<typeof textObject>);
  };

  if (!textObject) {
    return (
      <div className="space-y-4 p-5">
        <div className="rounded-xl border border-dashed border-purple-300/40 bg-gradient-to-br from-purple-50/10 to-pink-50/10 p-5 text-sm text-foreground-secondary shadow-sm">
          <div className="flex items-center gap-3 text-foreground">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20">
              <Type className="h-5 w-5 text-purple-600" />
            </div>
            <span className="font-bold text-purple-700">Add Text</span>
          </div>
          <p className="mt-3 text-sm text-foreground-secondary/70">Double-click the canvas to create a new text layer.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-5">
      <div className="space-y-3 rounded-xl border border-purple-200/40 bg-gradient-to-br from-purple-50/10 to-pink-50/10 p-4 shadow-sm">
        <label className="block text-xs font-bold uppercase tracking-[0.14em] text-purple-600">
          Content
          <textarea
            aria-label="Text content"
            value={textObject.text}
            rows={4}
            onChange={(event) => updateValue('text', event.target.value)}
            className="mt-2 w-full rounded-xl border border-purple-200/40 bg-white/40 px-3 py-2.5 text-sm text-foreground outline-none focus:border-purple-400/60 focus:ring-2 focus:ring-purple-500/20 transition font-medium"
          />
        </label>
      </div>

      <div className="space-y-3 rounded-xl border border-blue-200/40 bg-gradient-to-br from-blue-50/10 to-cyan-50/10 p-4 shadow-sm">
        <label className="block text-xs font-bold uppercase tracking-[0.14em] text-blue-600">
          Font
          <select
            aria-label="Font family"
            value={textObject.fontFamily}
            onChange={(event) => updateValue('fontFamily', event.target.value)}
            className="mt-2 w-full rounded-xl border border-blue-200/40 bg-white/40 px-3 py-2.5 text-sm text-foreground outline-none focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/20 transition font-medium"
          >
            {fontOptions.map((font) => (
              <option key={font} value={font}>{font.split(',')[0]}</option>
            ))}
          </select>
        </label>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.14em] text-slate-600">
            <span>Size</span>
            <span className="text-blue-600 font-bold">{textObject.fontSize}px</span>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" aria-label="Decrease font size" onClick={() => updateValue('fontSize', Math.max(8, textObject.fontSize - 4))} className="rounded-lg border border-blue-300/40 bg-gradient-to-r from-blue-50/50 to-cyan-50/30 p-2 text-blue-600 hover:border-blue-400/60 hover:from-blue-50/70"> <Minus className="h-4 w-4" /> </button>
            <input type="range" min={8} max={220} value={textObject.fontSize} onChange={(event) => updateValue('fontSize', Number(event.target.value))} className="w-full accent-blue-500" aria-label="Font size" />
            <button type="button" aria-label="Increase font size" onClick={() => updateValue('fontSize', Math.min(220, textObject.fontSize + 4))} className="rounded-lg border border-blue-300/40 bg-gradient-to-r from-blue-50/50 to-cyan-50/30 p-2 text-blue-600 hover:border-blue-400/60 hover:from-blue-50/70"> <Plus className="h-4 w-4" /> </button>
          </div>
        </div>

        <label className="block text-xs font-bold uppercase tracking-[0.14em] text-slate-600">
          Weight
          <select
            aria-label="Font weight"
            value={String(textObject.fontWeight)}
            onChange={(event) => updateValue('fontWeight', Number(event.target.value))}
            className="mt-2 w-full rounded-xl border border-blue-200/40 bg-white/40 px-3 py-2.5 text-sm text-foreground outline-none focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/20 transition font-medium"
          >
            {weights.map((weight) => (
              <option key={weight} value={weight}>{weight === 400 ? 'Regular' : weight === 500 ? 'Medium' : weight === 600 ? 'Semi Bold' : weight === 700 ? 'Bold' : 'Extra Bold'}</option>
            ))}
          </select>
        </label>

        <div className="grid grid-cols-3 gap-2">
          <button type="button" onClick={() => updateValue('italic', !textObject.italic)} className={`rounded-lg border px-2.5 py-2.5 text-sm font-bold transition ${textObject.italic ? 'border-purple-400/60 bg-gradient-to-r from-purple-500/20 to-purple-600/10 text-purple-700 shadow-sm' : 'border-slate-300/40 bg-gradient-to-r from-slate-50/50 to-slate-100/30 text-slate-600 hover:border-slate-400/50'}`} aria-label="Toggle italic"><Italic className="h-4 w-4 mx-auto" /></button>
          <button type="button" onClick={() => updateValue('underline', !textObject.underline)} className={`rounded-lg border px-2.5 py-2.5 text-sm font-bold transition ${textObject.underline ? 'border-blue-400/60 bg-gradient-to-r from-blue-500/20 to-blue-600/10 text-blue-700 shadow-sm' : 'border-slate-300/40 bg-gradient-to-r from-slate-50/50 to-slate-100/30 text-slate-600 hover:border-slate-400/50'}`} aria-label="Toggle underline"><Underline className="h-4 w-4 mx-auto" /></button>
          <button type="button" onClick={() => updateValue('fontWeight', textObject.fontWeight === 700 ? 400 : 700)} className={`rounded-lg border px-2.5 py-2.5 text-sm font-bold transition ${textObject.fontWeight === 700 ? 'border-orange-400/60 bg-gradient-to-r from-orange-500/20 to-orange-600/10 text-orange-700 shadow-sm' : 'border-slate-300/40 bg-gradient-to-r from-slate-50/50 to-slate-100/30 text-slate-600 hover:border-slate-400/50'}`} aria-label="Toggle bold"><Bold className="h-4 w-4 mx-auto" /></button>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-[0.14em] text-slate-600">
            <span>Alignment</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(['left', 'center', 'right'] as const).map((alignment) => (
              <button key={alignment} type="button" onClick={() => updateValue('textAlign', alignment)} className={`rounded-lg border px-2.5 py-2.5 transition ${textObject.textAlign === alignment ? 'border-green-400/60 bg-gradient-to-r from-green-500/20 to-green-600/10 text-green-700 shadow-sm' : 'border-slate-300/40 bg-gradient-to-r from-slate-50/50 to-slate-100/30 text-slate-600 hover:border-slate-400/50'}`} aria-label={`Align ${alignment}`}>
                {alignment === 'left' ? <AlignLeft className="h-4 w-4 mx-auto" /> : alignment === 'center' ? <AlignCenter className="h-4 w-4 mx-auto" /> : <AlignRight className="h-4 w-4 mx-auto" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3 rounded-xl border border-rose-200/40 bg-gradient-to-br from-rose-50/10 to-red-50/10 p-4 shadow-sm">
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-xs font-bold uppercase tracking-[0.14em] text-rose-600">
            Color
            <input type="color" aria-label="Text color" value={textObject.color} onChange={(event) => updateValue('color', event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-rose-300/40 bg-white p-1 cursor-pointer shadow-sm hover:shadow-md transition" />
          </label>
          <label className="block text-xs font-bold uppercase tracking-[0.14em] text-rose-600">
            Opacity
            <div className="mt-2">
              <input type="range" min={0} max={100} value={textObject.opacity} onChange={(event) => updateValue('opacity', Number(event.target.value))} className="w-full accent-rose-500" aria-label="Text opacity" />
              <span className="mt-1 block text-xs text-rose-600 font-bold">{textObject.opacity}%</span>
            </div>
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="block text-xs font-bold uppercase tracking-[0.14em] text-slate-600">
            Letter spacing
            <input type="number" value={textObject.letterSpacing} onChange={(event) => updateValue('letterSpacing', Number(event.target.value))} className="mt-2 w-full rounded-xl border border-slate-300/40 bg-gradient-to-r from-slate-50/50 to-slate-100/30 px-3 py-2.5 text-sm text-foreground outline-none focus:border-slate-400/60 focus:ring-2 focus:ring-slate-500/20 transition font-medium" />
          </label>
          <label className="block text-xs font-bold uppercase tracking-[0.14em] text-slate-600">
            Line height
            <input type="number" step={0.1} value={textObject.lineHeight} onChange={(event) => updateValue('lineHeight', Number(event.target.value))} className="mt-2 w-full rounded-xl border border-slate-300/40 bg-gradient-to-r from-slate-50/50 to-slate-100/30 px-3 py-2.5 text-sm text-foreground outline-none focus:border-slate-400/60 focus:ring-2 focus:ring-slate-500/20 transition font-medium" />
          </label>
        </div>

        <label className="block text-xs font-bold uppercase tracking-[0.14em] text-slate-600">
          Rotation
          <div className="mt-2">
            <input type="range" min={-180} max={180} value={textObject.rotation} onChange={(event) => updateValue('rotation', Number(event.target.value))} className="w-full accent-rose-500" aria-label="Text rotation" />
            <span className="mt-1 block text-xs text-rose-600 font-bold">{textObject.rotation}°</span>
          </div>
        </label>
      </div>
    </div>
  );
}
