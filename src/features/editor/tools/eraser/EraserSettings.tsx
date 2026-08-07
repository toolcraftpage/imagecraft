import { useToolSettingsStore } from '../../store/toolSettingsStore';

export default function EraserSettings() {
  const { brush, setBrush } = useToolSettingsStore();
  return (
    <div className="flex flex-col gap-3 p-4">
      <h4 className="text-sm font-semibold">Eraser</h4>
      <div>
        <label className="mb-1 block text-xs">Size</label>
        <input
          type="range"
          min="1"
          max="100"
          value={brush.size}
          onChange={(e) => setBrush({ size: Number(e.target.value) })}
          className="w-full accent-primary-500"
        />
        <span className="text-xs text-gray-500">{brush.size}px</span>
      </div>
    </div>
  );
}