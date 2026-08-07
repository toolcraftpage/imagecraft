import { useToolSettingsStore } from '../../store/toolSettingsStore';

export default function FillSettings() {
  const { brush, setBrush } = useToolSettingsStore();
  return (
    <div className="flex flex-col gap-3 p-4">
      <h4 className="text-sm font-semibold">Fill</h4>
      <div>
        <label className="mb-1 block text-xs">Fill Color</label>
        <input
          type="color"
          value={brush.color}
          onChange={(e) => setBrush({ color: e.target.value })}
          className="h-8 w-full cursor-pointer rounded border"
        />
      </div>
      <p className="text-xs text-gray-400">Click on a shape or text to fill it with this color.</p>
    </div>
  );
}