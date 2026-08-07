import { create } from 'zustand';
import type { Canvas, Object as FabricObject } from 'fabric';
import type { ToolId, RightPanelTab } from '../types';

export interface EditorState {
  canvas: Canvas | null;
  setCanvas: (c: Canvas) => void;
  hasImages: boolean;
  setHasImages: (v: boolean) => void;
  activeTool: ToolId;
  setActiveTool: (t: ToolId) => void;
  zoom: number;
  setZoom: (z: number) => void;
  rightPanelTab: RightPanelTab;
  setRightPanelTab: (t: RightPanelTab) => void;
  activeObject: FabricObject | null;
  setActiveObject: (obj: FabricObject | null) => void;
  brushColor: string;
  setBrushColor: (c: string) => void;
  brushSize: number;
  setBrushSize: (s: number) => void;
  history: string[];
  historyIndex: number;
  pushHistory: (state: string) => void;
  undo: () => string | null;
  redo: () => string | null;
  canUndo: boolean;
  canRedo: boolean;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  canvas: null,
  setCanvas: (canvas) => set({ canvas }),
  hasImages: false,
  setHasImages: (v) => set({ hasImages: v }),
  activeTool: 'select',
  setActiveTool: (activeTool) => set({ activeTool }),
  zoom: 1,
  setZoom: (zoom) => set({ zoom }),
  rightPanelTab: 'layers',
  setRightPanelTab: (rightPanelTab) => set({ rightPanelTab }),
  activeObject: null,
  setActiveObject: (activeObject) => set({ activeObject }),
  brushColor: '#000000',
  setBrushColor: (brushColor) => set({ brushColor }),
  brushSize: 10,
  setBrushSize: (brushSize) => set({ brushSize }),
  history: [],
  historyIndex: -1,
  canUndo: false,
  canRedo: false,
  pushHistory: (state) => {
    const { history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(state);
    set({ history: newHistory, historyIndex: newHistory.length - 1, canUndo: true, canRedo: false });
  },
  undo: () => {
    const { history, historyIndex, canvas } = get();
    if (historyIndex <= 0 || !canvas) return null;
    const newIndex = historyIndex - 1;
    set({ historyIndex: newIndex, canUndo: newIndex > 0, canRedo: true });
    return history[newIndex];
  },
  redo: () => {
    const { history, historyIndex, canvas } = get();
    if (historyIndex >= history.length - 1 || !canvas) return null;
    const newIndex = historyIndex + 1;
    set({ historyIndex: newIndex, canRedo: newIndex < history.length - 1, canUndo: true });
    return history[newIndex];
  },
}));