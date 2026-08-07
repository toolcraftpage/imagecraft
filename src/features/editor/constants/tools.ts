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
import type { EditorTool } from '../types';

export const TOOLS: EditorTool[] = [
  { id: 'select',  label: 'Select',  icon: MousePointer2,       shortcut: 'V' },
  { id: 'pan',     label: 'Hand',     icon: Hand,                shortcut: 'H' },
  { id: 'brush',   label: 'Brush',    icon: Paintbrush,          shortcut: 'B' },
  { id: 'eraser',  label: 'Eraser',   icon: Eraser,              shortcut: 'E' },
  { id: 'rectangle', label: 'Rectangle', icon: RectangleHorizontal, shortcut: 'R' },
  { id: 'ellipse', label: 'Ellipse',  icon: Circle,              shortcut: 'O' },
  { id: 'line',    label: 'Line',     icon: Minus,               shortcut: 'L' },
  { id: 'text',    label: 'Text',     icon: Type,                shortcut: 'T' },
  { id: 'eyedropper', label: 'Eyedropper', icon: Pipette,        shortcut: 'I' },
  { id: 'fill',    label: 'Fill',     icon: PaintBucket,         shortcut: 'G' },
  { id: 'crop',    label: 'Crop',     icon: Crop,                shortcut: 'C' },
];