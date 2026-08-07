import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface BrushSettings {
  size: number;
  color: string;
}

export interface ShapeSettings {
  fill: string;
  stroke: string;
  strokeWidth: number;
}

export interface TextSettings {
  fontFamily: string;
  fontSize: number;
  color: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  textAlign: 'left' | 'center' | 'right';
}

interface ToolSettingsState {
  brush: BrushSettings;
  shapes: ShapeSettings;
  text: TextSettings;
  setBrush: (s: Partial<BrushSettings>) => void;
  setShapes: (s: Partial<ShapeSettings>) => void;
  setText: (s: Partial<TextSettings>) => void;
}

export const useToolSettingsStore = create<ToolSettingsState>()(
  persist(
    (set) => ({
      brush: { size: 10, color: '#000000' },
      shapes: { fill: 'rgba(99,102,241,0.3)', stroke: '#6366f1', strokeWidth: 2 },
      text: {
        fontFamily: 'Inter',
        fontSize: 24,
        color: '#000000',
        bold: false,
        italic: false,
        underline: false,
        textAlign: 'left',
      },
      setBrush: (s) => set((state) => ({ brush: { ...state.brush, ...s } })),
      setShapes: (s) => set((state) => ({ shapes: { ...state.shapes, ...s } })),
      setText: (s) => set((state) => ({ text: { ...state.text, ...s } })),
    }),
    { name: 'editor-tool-settings' },
  ),
);