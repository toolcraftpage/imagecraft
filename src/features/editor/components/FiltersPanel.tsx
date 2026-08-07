import { useEditorStore } from '../store/editorStore';
import Button from '@/shared/components/ui/Button';

const filters = [
  { name: 'Grayscale', filter: 'Grayscale' },
  { name: 'Sepia', filter: 'Sepia' },
  { name: 'Invert', filter: 'Invert' },
  { name: 'Blur', filter: 'Blur' },
];

export default function FiltersPanel() {
  const { canvas, pushHistory } = useEditorStore();
  const apply = (filterName: string) => {
    if (!canvas) return;
    const obj = canvas.getActiveObject() || canvas;
    let filter;
    if (filterName === 'Grayscale') filter = new (window as any).fabric.Image.filters.Grayscale();
    else if (filterName === 'Sepia') filter = new (window as any).fabric.Image.filters.Sepia();
    else if (filterName === 'Invert') filter = new (window as any).fabric.Image.filters.Invert();
    else if (filterName === 'Blur') filter = new (window as any).fabric.Image.filters.Blur({ blur: 0.5 });
    if (filter) { obj.filters = [filter]; obj.applyFilters(); canvas.renderAll(); pushHistory(JSON.stringify(canvas.toJSON())); }
  };
  return (
    <div className="p-4 text-xs">
      <h4 className="text-sm font-semibold mb-3">Filters</h4>
      <div className="flex flex-wrap gap-2">
        {filters.map(f => <Button key={f.name} variant="secondary" size="sm" onClick={() => apply(f.filter)}>{f.name}</Button>)}
      </div>
    </div>
  );
}