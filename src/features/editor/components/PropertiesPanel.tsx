import { useEditorStore } from '../store/editorStore';

const fontOptions = ['Inter, Arial, sans-serif', 'Arial, sans-serif', 'Helvetica, sans-serif', 'Georgia, serif', 'Times New Roman, serif', 'Verdana, sans-serif', 'Trebuchet MS, sans-serif', 'Courier New, monospace'];

export default function PropertiesPanel() {
  const { textObjects, selectedObject, updateTextObject, deleteTextObject, setSelectedObject, setEditingTextId } = useEditorStore();

  const textObject = selectedObject ? textObjects.find((item) => item.id === selectedObject && item.type === 'text') ?? null : null;

  if (!textObject) {
    return (
      <div className="space-y-4 p-4">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">Object</label>
          <p className="mt-2 text-sm text-foreground">No object selected</p>
        </div>
      </div>
    );
  }

  const updateValue = <K extends keyof typeof textObject>(key: K, value: (typeof textObject)[K]) => {
    updateTextObject(textObject.id, { [key]: value } as Partial<typeof textObject>);
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface-muted px-3 py-2">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground-muted">Text</span>
        <button
          type="button"
          onClick={() => {
            deleteTextObject(textObject.id);
            setSelectedObject(null);
            setEditingTextId(null);
          }}
          className="rounded-lg border border-border bg-background px-2 py-1 text-xs text-foreground-secondary hover:text-foreground"
        >
          Delete
        </button>
      </div>

      <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-foreground-muted">
        Content
        <textarea
          aria-label="Text content"
          value={textObject.text}
          onChange={(event) => updateValue('text', event.target.value)}
          rows={4}
          className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
        />
      </label>

      <div className="space-y-3">
        <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-foreground-muted">
          Font
          <select
            aria-label="Font family"
            value={textObject.fontFamily}
            onChange={(event) => updateValue('fontFamily', event.target.value)}
            className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
          >
            {fontOptions.map((font) => (
              <option key={font} value={font}>{font.split(',')[0]}</option>
            ))}
          </select>
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-foreground-muted">
            Size
            <input
              aria-label="Font size"
              type="number"
              min={8}
              max={240}
              value={textObject.fontSize}
              onChange={(event) => updateValue('fontSize', Number(event.target.value) || 16)}
              className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
            />
          </label>

          <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-foreground-muted">
            Weight
            <select
              aria-label="Font weight"
              value={textObject.fontWeight}
              onChange={(event) => updateValue('fontWeight', event.target.value)}
              className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
            >
              <option value={400}>Regular</option>
              <option value={500}>Medium</option>
              <option value={600}>Semi Bold</option>
              <option value={700}>Bold</option>
              <option value={800}>Extra Bold</option>
            </select>
          </label>
        </div>

        <div className="flex items-center gap-4 text-sm text-foreground-secondary">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={textObject.italic} onChange={(event) => updateValue('italic', event.target.checked)} />
            Italic
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={textObject.underline} onChange={(event) => updateValue('underline', event.target.checked)} />
            Underline
          </label>
        </div>

        <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-foreground-muted">
          Alignment
          <div className="mt-2 grid grid-cols-3 gap-2">
            {(['left', 'center', 'right'] as const).map((alignment) => (
              <button
                key={alignment}
                type="button"
                onClick={() => updateValue('textAlign', alignment)}
                className={`rounded-lg border px-2 py-2 text-xs font-medium ${
                  textObject.textAlign === alignment ? 'border-accent bg-accent-soft text-accent' : 'border-border bg-background text-foreground-secondary'
                }`}
              >
                {alignment.charAt(0).toUpperCase() + alignment.slice(1)}
              </button>
            ))}
          </div>
        </label>
      </div>

      <div className="space-y-3 border-t border-border pt-4">
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-foreground-muted">
            Color
            <input
              aria-label="Text color"
              type="color"
              value={textObject.color}
              onChange={(event) => updateValue('color', event.target.value)}
              className="mt-2 h-10 w-full rounded-lg border border-border bg-background p-1"
            />
          </label>

          <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-foreground-muted">
            Opacity
            <input
              aria-label="Text opacity"
              type="range"
              min={0}
              max={100}
              value={textObject.opacity}
              onChange={(event) => updateValue('opacity', Number(event.target.value))}
              className="mt-2 w-full"
            />
            <span className="mt-1 block text-xs text-foreground-secondary">{textObject.opacity}%</span>
          </label>
        </div>
      </div>

      <div className="space-y-3 border-t border-border pt-4">
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-foreground-muted">
            X
            <input type="number" value={Math.round(textObject.x)} onChange={(event) => updateValue('x', Number(event.target.value))} className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent" />
          </label>
          <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-foreground-muted">
            Y
            <input type="number" value={Math.round(textObject.y)} onChange={(event) => updateValue('y', Number(event.target.value))} className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent" />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-foreground-muted">
            Width
            <input type="number" min={8} value={Math.round(textObject.width)} onChange={(event) => updateValue('width', Math.max(8, Number(event.target.value)))} className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent" />
          </label>
          <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-foreground-muted">
            Height
            <input type="number" min={8} value={Math.round(textObject.height)} onChange={(event) => updateValue('height', Math.max(8, Number(event.target.value)))} className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent" />
          </label>
        </div>

        <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-foreground-muted">
          Rotation
          <input type="range" min={-180} max={180} value={textObject.rotation} onChange={(event) => updateValue('rotation', Number(event.target.value))} className="mt-2 w-full" />
          <span className="mt-1 block text-xs text-foreground-secondary">{textObject.rotation}°</span>
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-foreground-muted">
            Letter spacing
            <input type="number" value={textObject.letterSpacing} onChange={(event) => updateValue('letterSpacing', Number(event.target.value))} className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent" />
          </label>
          <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-foreground-muted">
            Line height
            <input type="number" step={0.1} value={textObject.lineHeight} onChange={(event) => updateValue('lineHeight', Number(event.target.value))} className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent" />
          </label>
        </div>
      </div>
    </div>
  );
}
