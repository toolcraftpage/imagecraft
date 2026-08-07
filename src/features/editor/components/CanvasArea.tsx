import { useRef, useEffect } from 'react';
import { useEditorStore } from '../store/editorStore';
import { useCanvas } from '../hooks/useCanvas';
import { useToolManager } from '../hooks/useToolManager';
import UploadScreen from './UploadScreen';

export default function CanvasArea() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { hasImages } = useEditorStore();
  useCanvas(canvasRef.current);
  useToolManager();
  return (
    <div className="relative flex-1 overflow-hidden bg-gray-100 dark:bg-gray-900">
      <canvas ref={canvasRef} className="absolute inset-0" />
      {!hasImages && <UploadScreen />}
    </div>
  );
}