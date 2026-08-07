import { useEditorStore } from '../store/editorStore';

export default function PropertiesPanel() {
  const { activeObject } = useEditorStore();
  if (!activeObject) {
    return <div className="p-4 text-xs text-gray-400">No object selected</div>;
  }
  return (
    <div className="p-4 text-xs">
      <p><strong>Type:</strong> {activeObject.type}</p>
      <p><strong>Width:</strong> {Math.round(activeObject.width! * (activeObject.scaleX || 1))}px</p>
      <p><strong>Height:</strong> {Math.round(activeObject.height! * (activeObject.scaleY || 1))}px</p>
      <p><strong>Angle:</strong> {Math.round(activeObject.angle!)}°</p>
      <p><strong>Opacity:</strong> {Math.round(activeObject.opacity! * 100)}%</p>
    </div>
  );
}