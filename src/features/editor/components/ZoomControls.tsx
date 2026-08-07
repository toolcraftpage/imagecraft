import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';
import Button from '@/shared/components/ui/Button';

export default function ZoomControls() {
  const { zoom, setZoom } = useEditorStore();
  return (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="sm" onClick={() => setZoom(Math.max(0.1, zoom - 0.1))} className="p-1">
        <ZoomOut size={16} />
      </Button>
      <span className="w-14 text-center text-xs font-medium text-gray-600 dark:text-gray-400">
        {Math.round(zoom * 100)}%
      </span>
      <Button variant="ghost" size="sm" onClick={() => setZoom(Math.min(5, zoom + 0.1))} className="p-1">
        <ZoomIn size={16} />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => setZoom(1)} className="p-1">
        <Maximize size={16} />
      </Button>
    </div>
  );
}