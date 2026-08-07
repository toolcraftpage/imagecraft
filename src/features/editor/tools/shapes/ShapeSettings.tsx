import { useToolSettingsStore } from '../../store/toolSettingsStore';
import Input from '@/shared/components/ui/Input';

export default function ShapeSettings() {
  const { shapes, setShapes } = useToolSettingsStore();

  return (
    <div className="flex flex-col gap-3 p-4">
      <h4 className="text-sm font-semibold">Shapes</h4>
      <div>
        <label className="mb-1 block text-xs">Fill</label>
        <input
          type="color"
          value={shapes.fill}
          onChange={(e) => setShapes({ fill: e.target.value })}
          className="h-8 w-full cursor-pointer rounded border"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs">Stroke</label>
        <input
          type="color"
          value={shapes.stroke}
          onChange={(e) => setShapes({ stroke: e.target.value })}
          className="h-8 w-full cursor-pointer rounded border"
        />
      </div>
      <Input
        label="Stroke Width"
        type="number"
        value={shapes.strokeWidth}
        onChange={(e) => setShapes({ strokeWidth: Number(e.target.value) })}
        min={0}
        max={50}
      />
    </div>
  );
}