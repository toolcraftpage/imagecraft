/**
 * Lightweight editor store for UI state and history management
 */

import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export type EditorTool =
  | 'select'
  | 'crop'
  | 'adjust'
  | 'resize'
  | 'transform'
  | 'brush'
  | 'draw'
  | 'eraser'
  | 'text'
  | 'shapes'
  | 'stickers'
  | 'frame'
  | 'corners'
  | 'filter'
  | 'filters'
  | 'background'
  | 'background-remover'
  | 'effects'
  | 'meme'
  | 'watermark'
  | 'collage'
  | 'social'
  | 'layers'
  | 'eyedropper';
export type SidebarTab = 'properties' | 'layers' | 'adjustments';
export type TextAlignment = 'left' | 'center' | 'right';

export interface EditorTextObject {
  id: string;
  type: 'text' | 'shape' | 'sticker' | 'image';
  name: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  fontFamily: string;
  fontSize: number;
  fontWeight: number | string;
  italic: boolean;
  underline: boolean;
  color: string;
  fill: string;
  stroke: string;
  strokeWidth: number;
  opacity: number;
  textAlign: TextAlignment;
  letterSpacing: number;
  lineHeight: number;
  shapeType?: 'rectangle' | 'circle' | 'line' | 'arrow';
  imageSrc?: string;
  visible?: boolean;
  locked?: boolean;
  cornerRadius?: number;
  effect?: 'none' | 'glow' | 'vignette' | 'sepia';
}

export interface HistoryEntry {
  id: string;
  type: string;
  timestamp: number;
  description: string;
  data?: {
    before?: EditorTextObject[];
    after?: EditorTextObject[];
    [key: string]: unknown;
  };
}

const cloneTextObjects = (objects: EditorTextObject[]) => objects.map((item) => ({ ...item }));

export interface EditorState {
  activeTool: EditorTool;
  selectedObject: string | null;
  zoom: number;
  panX: number;
  panY: number;
  sidebarTab: SidebarTab;
  sidebarCollapsed: boolean;
  documentName: string;
  isDirty: boolean;
  canvasWidth: number;
  canvasHeight: number;
  exportDialogOpen: boolean;
  shortcutsOpen: boolean;
  textObjects: EditorTextObject[];
  editingTextId: string | null;
  history: HistoryEntry[];
  historyIndex: number;
  setActiveTool: (tool: EditorTool) => void;
  setSelectedObject: (id: string | null) => void;
  setTextObjects: (objects: EditorTextObject[]) => void;
  addTextObject: (object: Partial<EditorTextObject> & { id?: string }) => EditorTextObject;
  updateTextObject: (id: string, patch: Partial<EditorTextObject>) => void;
  deleteTextObject: (id: string) => void;
  setEditingTextId: (id: string | null) => void;
  setZoom: (zoom: number) => void;
  setPan: (x: number, y: number) => void;
  setSidebarTab: (tab: SidebarTab) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setDocumentName: (name: string) => void;
  setCanvasDimensions: (width: number, height: number) => void;
  setExportDialogOpen: (open: boolean) => void;
  setShortcutsOpen: (open: boolean) => void;
  pushHistory: (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  clearHistory: () => void;
  markDirty: () => void;
  markClean: () => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  activeTool: 'select',
  selectedObject: null,
  zoom: 100,
  panX: 0,
  panY: 0,
  sidebarTab: 'properties',
  sidebarCollapsed: false,
  documentName: 'Untitled',
  isDirty: false,
  canvasWidth: 1200,
  canvasHeight: 800,
  exportDialogOpen: false,
  shortcutsOpen: false,
  textObjects: [],
  editingTextId: null,
  history: [],
  historyIndex: -1,

  setActiveTool: (tool) => set({ activeTool: tool }),
  setSelectedObject: (id) => set({ selectedObject: id }),
  setTextObjects: (objects) => set({ textObjects: objects }),
  addTextObject: (textObject) => {
    const id = textObject.id ?? uuidv4();
    const nextObject: EditorTextObject = {
      ...(textObject as Partial<EditorTextObject>),
      id,
      type: textObject.type ?? 'text',
      name: textObject.name ?? (textObject.type === 'shape' ? 'Shape layer' : textObject.type === 'sticker' ? 'Sticker layer' : 'Text layer'),
      text: textObject.text ?? 'Type something...',
      x: textObject.x ?? 80,
      y: textObject.y ?? 80,
      width: textObject.width ?? 220,
      height: textObject.height ?? 52,
      rotation: textObject.rotation ?? 0,
      fontFamily: textObject.fontFamily ?? 'Inter, Arial, sans-serif',
      fontSize: textObject.fontSize ?? 32,
      fontWeight: textObject.fontWeight ?? 600,
      italic: textObject.italic ?? false,
      underline: textObject.underline ?? false,
      color: textObject.color ?? '#111827',
      fill: textObject.fill ?? '#ffffff',
      stroke: textObject.stroke ?? '#111827',
      strokeWidth: textObject.strokeWidth ?? 2,
      opacity: textObject.opacity ?? 100,
      textAlign: textObject.textAlign ?? 'left',
      letterSpacing: textObject.letterSpacing ?? 0,
      lineHeight: textObject.lineHeight ?? 1.2,
      cornerRadius: textObject.cornerRadius ?? 0,
      effect: textObject.effect ?? 'none',
      visible: textObject.visible ?? true,
      locked: textObject.locked ?? false,
      shapeType: textObject.shapeType ?? 'rectangle',
      imageSrc: textObject.imageSrc,
    };
    set((state) => ({ textObjects: [...state.textObjects, nextObject], selectedObject: id, editingTextId: nextObject.type === 'text' ? id : null }));
    return nextObject;
  },
  updateTextObject: (id, patch) => {
    set((state) => ({
      textObjects: state.textObjects.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }));
  },
  deleteTextObject: (id) => {
    set((state) => ({
      textObjects: state.textObjects.filter((item) => item.id !== id),
      selectedObject: state.selectedObject === id ? null : state.selectedObject,
      editingTextId: state.editingTextId === id ? null : state.editingTextId,
    }));
  },
  setEditingTextId: (id) => set({ editingTextId: id }),
  setZoom: (zoom) => set({ zoom: Math.max(25, Math.min(400, zoom)) }),
  setPan: (x, y) => set({ panX: x, panY: y }),
  setSidebarTab: (tab) => set({ sidebarTab: tab }),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setDocumentName: (name) => set({ documentName: name, isDirty: true }),
  setCanvasDimensions: (width, height) => set({ canvasWidth: width, canvasHeight: height }),
  setExportDialogOpen: (open) => set({ exportDialogOpen: open }),
  setShortcutsOpen: (open) => set({ shortcutsOpen: open }),

  pushHistory: (entry) => {
    const state = get();
    const trimmed = state.history.slice(0, state.historyIndex + 1);
    const bounded = trimmed.length >= 50 ? trimmed.slice(1) : trimmed;

    const newEntry: HistoryEntry = {
      ...entry,
      id: uuidv4(),
      timestamp: Date.now(),
      data: {
        ...entry.data,
        before: entry.data?.before ? cloneTextObjects(entry.data.before) : cloneTextObjects(state.textObjects),
        after: entry.data?.after ? cloneTextObjects(entry.data.after) : cloneTextObjects(state.textObjects),
      },
    };

    set({
      history: [...bounded, newEntry],
      historyIndex: bounded.length,
      isDirty: true,
    });
  },

  undo: () => {
    const state = get();
    if (state.historyIndex <= 0) {
      set({ historyIndex: -1, textObjects: [], selectedObject: null, editingTextId: null });
      return;
    }

    const previousEntry = state.history[state.historyIndex - 1];
    const snapshot = previousEntry?.data?.before ?? state.textObjects;

    set({
      historyIndex: state.historyIndex - 1,
      textObjects: cloneTextObjects(snapshot),
      selectedObject: snapshot.find((item: EditorTextObject) => item.id === state.selectedObject)?.id ?? null,
      editingTextId: null,
    });
  },

  redo: () => {
    const state = get();
    const nextIndex = state.historyIndex + 1;
    if (nextIndex >= state.history.length) return;

    const nextEntry = state.history[nextIndex];
    const snapshot = nextEntry?.data?.after ?? state.textObjects;

    set({
      historyIndex: nextIndex,
      textObjects: cloneTextObjects(snapshot),
      selectedObject: snapshot.find((item: EditorTextObject) => item.id === state.selectedObject)?.id ?? null,
      editingTextId: null,
    });
  },

  canUndo: () => get().historyIndex >= 0,
  canRedo: () => get().historyIndex < get().history.length - 1,

  clearHistory: () => set({ history: [], historyIndex: -1 }),
  markDirty: () => set({ isDirty: true }),
  markClean: () => set({ isDirty: false }),
}));
