import { Undo, Redo } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';
import Button from '@/shared/components/ui/Button';

export default function HistoryControls() {
  const { undo, redo, canUndo, canRedo, canvas } = useEditorStore();

  const handleUndo = () => {
    const state = undo();
    if (state && canvas) canvas.loadFromJSON(JSON.parse(state), () => canvas.renderAll());
  };
  const handleRedo = () => {
    const state = redo();
    if (state && canvas) canvas.loadFromJSON(JSON.parse(state), () => canvas.renderAll());
  };

  return (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="sm" onClick={handleUndo} disabled={!canUndo} className="p-1">
        <Undo size={16} />
      </Button>
      <Button variant="ghost" size="sm" onClick={handleRedo} disabled={!canRedo} className="p-1">
        <Redo size={16} />
      </Button>
    </div>
  );
}