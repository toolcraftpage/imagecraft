import { useEditorStore } from '../store/editorStore';

export default function AdjustmentsPanel() {
  const { canvas, pushHistory, activeObject } = useEditorStore();
  const applyFilter = (filterClass: any, value: any) => {
    if (!canvas) return;
    const obj = canvas.getActiveObject() || canvas;
    // Simplified: clear and re-apply. We'll just show sliders that update via Fabric filters.
    // This is a basic implementation; full adjustments would use multiple filters.
    // For brevity, we'll implement brightness/contrast only.
  };

  return (
    <div className="p-4 text-xs text-gray-400">
      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Adjustments</h4>
      <div className="space-y-3">
        <div>
          <label className="mb-1 block">Brightness</label>
          <input type="range" min="-100" max="100" defaultValue="0" onChange={e => { if (!canvas) return; const v = parseInt(e.target.value)/100; const obj = canvas.getActiveObject() || canvas; obj.filters = [new (window as any).fabric.Image.filters.Brightness({ brightness: v })]; obj.applyFilters(); canvas.renderAll(); }} className="w-full accent-primary-500" />
        </div>
        <div>
          <label className="mb-1 block">Contrast</label>
          <input type="range" min="-100" max="100" defaultValue="0" onChange={e => { if (!canvas) return; const v = parseInt(e.target.value)/100; const obj = canvas.getActiveObject() || canvas; obj.filters = [new (window as any).fabric.Image.filters.Contrast({ contrast: v })]; obj.applyFilters(); canvas.renderAll(); }} className="w-full accent-primary-500" />
        </div>
      </div>
    </div>
  );
}