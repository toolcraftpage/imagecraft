import { useEditorStore } from '../store/editorStore';
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';

export default function StatusBar() {
  const { zoom, setZoom, canvas } = useEditorStore();
  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-surface px-4 py-1 text-xs dark:border-gray-700">
      <span>{canvas ? `${canvas.width} × ${canvas.height}` : ''}</span>
      <div className="flex items-center gap-2">
        <button onClick={() => setZoom(Math.max(0.1, zoom-0.1))}><ZoomOut size={14}/></button>
        <span className="w-12 text-center">{Math.round(zoom*100)}%</span>
        <button onClick={() => setZoom(Math.min(5, zoom+0.1))}><ZoomIn size={14}/></button>
        <button onClick={() => setZoom(1)}><Maximize size={14}/></button>
      </div>
    </div>
  );
}