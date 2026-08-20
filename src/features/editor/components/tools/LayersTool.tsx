import { Layers3 } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';

export default function LayersTool() {
  const { textObjects, selectedObject, setSelectedObject, deleteTextObject } = useEditorStore();

  return (
    <div className="space-y-5 p-5">
      <div className="rounded-xl border border-emerald-200/40 bg-gradient-to-br from-emerald-50/10 to-green-50/10 p-4 shadow-sm">
        <div className="flex items-center gap-3 text-foreground">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/20 to-green-500/20">
            <Layers3 className="h-5 w-5 text-emerald-600" />
          </div>
          <span className="text-base font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">Layer Stack</span>
        </div>
      </div>

      <div className="space-y-2 rounded-xl border border-emerald-200/40 bg-gradient-to-br from-emerald-50/10 to-green-50/10 p-5 shadow-sm max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-300/40 scrollbar-track-transparent">
        {textObjects.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm font-semibold text-emerald-600 mb-1">No layers yet</p>
            <p className="text-xs text-emerald-600/70">Add text, shapes, or stickers to create layers</p>
          </div>
        ) : (
          textObjects.map((layer) => (
            <div
              key={layer.id}
              className={`flex items-center justify-between rounded-lg border px-3 py-3 transition cursor-pointer ${selectedObject === layer.id ? 'border-emerald-400/60 bg-gradient-to-r from-emerald-500/20 to-green-600/10 ring-2 ring-emerald-500/30' : 'border-emerald-300/40 bg-gradient-to-r from-emerald-50/40 to-green-50/30 hover:border-emerald-400/60 hover:from-emerald-100/40'}`}
            >
              <button type="button" onClick={() => setSelectedObject(layer.id)} className="min-w-0 flex-1 text-left">
                <p className="truncate text-sm font-bold text-emerald-700">{layer.name || 'Layer'}</p>
                <p className="text-xs text-emerald-600/70 capitalize">{layer.type}</p>
              </button>
              <button type="button" onClick={() => deleteTextObject(layer.id)} className="ml-2 flex-shrink-0 rounded-lg border border-red-300/40 bg-gradient-to-r from-red-50/40 to-pink-50/30 px-2 py-1.5 text-xs font-bold text-red-700 transition hover:border-red-400/60 hover:from-red-100/40 active:scale-95">
                ✕
              </button>
            </div>
          ))
        )}
      </div>

      <div className="rounded-xl border border-blue-300/40 bg-gradient-to-br from-blue-50/20 to-cyan-50/20 p-4">
        <p className="text-xs text-center text-blue-700 font-semibold">📋 Click layer to select, delete button to remove</p>
      </div>
    </div>
  );
}
