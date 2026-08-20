import { LayoutGrid } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';

export default function CollageTool() {
  const { addTextObject } = useEditorStore();

  const addGrid = () => {
    addTextObject({
      type: 'shape',
      name: 'Collage guide',
      shapeType: 'rectangle',
      text: '',
      x: 20,
      y: 20,
      width: 660,
      height: 420,
      rotation: 0,
      fill: 'transparent',
      stroke: '#94a3b8',
      strokeWidth: 2,
      opacity: 100,
      color: '#94a3b8',
      fontFamily: 'Inter, Arial, sans-serif',
      fontSize: 18,
      fontWeight: 600,
      italic: false,
      underline: false,
      textAlign: 'left',
      letterSpacing: 0,
      lineHeight: 1.2,
      visible: true,
      locked: false,
    });
  };

  return (
    <div className="space-y-5 p-5">
      <div className="rounded-xl border border-sky-200/40 bg-gradient-to-br from-sky-50/10 to-blue-50/10 p-4 shadow-sm">
        <div className="flex items-center gap-3 text-foreground">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500/20 to-blue-500/20">
            <LayoutGrid className="h-5 w-5 text-sky-600" />
          </div>
          <span className="text-base font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">Collage Layout</span>
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-sky-300/40 bg-gradient-to-br from-sky-50/20 to-blue-50/20 p-5 text-sm text-sky-700 shadow-sm">
        <p className="font-semibold mb-2">📐 How to create a collage:</p>
        <p className="text-xs text-sky-600/70">1. Add a collage guide to the canvas</p>
        <p className="text-xs text-sky-600/70 mt-1">2. Use it as a reference for placing images</p>
        <p className="text-xs text-sky-600/70 mt-1">3. Adjust sizes and positions freely</p>
      </div>

      <button type="button" onClick={addGrid} className="w-full rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:from-sky-600 hover:to-blue-700 shadow-lg hover:shadow-xl active:scale-95">
        ➕ Add Collage Grid
      </button>
    </div>
  );
}
