import { useEditorStore } from '../store/editorStore';

export default function StatusBar() {
  const { zoom, activeTool, canvasWidth, canvasHeight, isDirty } = useEditorStore();

  const toolLabel = activeTool.charAt(0).toUpperCase() + activeTool.slice(1).replace('-', ' ');

  return (
    <footer className="border-t border-border bg-surface px-4 py-2 text-xs text-foreground-secondary">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span>{Math.round(zoom)}%</span>
          <span>•</span>
          <span>
            {canvasWidth} × {canvasHeight}
          </span>
          <span>•</span>
          <span>{toolLabel}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>{isDirty ? 'Unsaved changes' : 'Ready'}</span>
        </div>
      </div>
    </footer>
  );
}
