import { useEditorStore } from '../store/editorStore';
import Tooltip from '@/shared/components/ui/Tooltip';   // ← default import
import {
  MousePointer2,
  Hand,
  Paintbrush,
  Eraser,
  RectangleHorizontal,
  Circle,
  Minus,
  Type,
  Pipette,
  PaintBucket,
  Crop,
} from 'lucide-react';
import type { ToolId } from '../types';

const tools: { id: ToolId; icon: any; label: string; shortcut: string }[] = [
  { id: 'select', icon: MousePointer2, label: 'Select', shortcut: 'V' },
  { id: 'pan', icon: Hand, label: 'Hand', shortcut: 'H' },
  { id: 'brush', icon: Paintbrush, label: 'Brush', shortcut: 'B' },
  { id: 'eraser', icon: Eraser, label: 'Eraser', shortcut: 'E' },
  { id: 'rectangle', icon: RectangleHorizontal, label: 'Rectangle', shortcut: 'R' },
  { id: 'ellipse', icon: Circle, label: 'Ellipse', shortcut: 'O' },
  { id: 'line', icon: Minus, label: 'Line', shortcut: 'L' },
  { id: 'text', icon: Type, label: 'Text', shortcut: 'T' },
  { id: 'eyedropper', icon: Pipette, label: 'Eyedropper', shortcut: 'I' },
  { id: 'fill', icon: PaintBucket, label: 'Fill', shortcut: 'G' },
  { id: 'crop', icon: Crop, label: 'Crop', shortcut: 'C' },
];

export default function Toolbar() {
  const { activeTool, setActiveTool, hasImages } = useEditorStore();

  return (
    <div className="flex w-14 flex-col items-center gap-2 border-r border-gray-200 bg-surface p-2 dark:border-gray-700 dark:bg-surface overflow-y-auto">
      {tools.map((t) => (
        <Tooltip key={t.id} content={`${t.label} (${t.shortcut})`} placement="right">
          <button
            onClick={() => setActiveTool(t.id)}
            disabled={!hasImages && t.id !== 'select'}
            className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
              !hasImages && t.id !== 'select' ? 'opacity-50 cursor-not-allowed' : ''
            } ${
              activeTool === t.id
                ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300'
                : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
            }`}
          >
            <t.icon size={20} />
          </button>
        </Tooltip>
      ))}
    </div>
  );
}