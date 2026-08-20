/**
 * Editor domain types and interfaces
 */

export type EditorTool = 
  | 'select' | 'move' | 'zoom'
  | 'crop' | 'brush' | 'eraser'
  | 'text' | 'rectangle' | 'circle' | 'line' | 'arrow'
  | 'eyedropper' | 'fill'
  | 'blur' | 'filters'
  | 'background-remover';

export type LayerType = 'image' | 'text' | 'shape' | 'drawing';

export type BlendMode = 'normal' | 'multiply' | 'screen' | 'overlay' | 'soft-light' | 'hard-light' | 'color-dodge' | 'color-burn';

/**
 * Represents a single layer in the editor
 */
export interface EditorLayer {
  id: string;
  type: LayerType;
  name: string;
  visible: boolean;
  locked: boolean;
  opacity: number;
  blendMode: BlendMode;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  
  // Layer-specific data
  canvas?: HTMLCanvasElement;           // For drawing/raster layers
  imageData?: ImageData;                // For pixel manipulation
  text?: string;                        // For text layers
  textProperties?: TextProperties;      // Font, size, etc.
  shapeType?: string;                   // rectangle, circle, etc.
  shapeProperties?: ShapeProperties;    // Fill, stroke, etc.
}

export interface TextProperties {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  italic: boolean;
  underline: boolean;
  textAlign: 'left' | 'center' | 'right';
  color: string;
  letterSpacing: number;
  lineHeight: number;
}

export interface ShapeProperties {
  fill: string;
  stroke: string;
  strokeWidth: number;
}

/**
 * Represents the document/canvas state
 */
export interface EditorDocument {
  id: string;
  name: string;
  width: number;
  height: number;
  backgroundColor: string;
  layers: EditorLayer[];
  activeLayerId: string | null;
}

/**
 * Represents a history action
 */
export interface HistoryAction {
  type: string;
  timestamp: number;
  description: string;
  
  // Store necessary state to undo/redo
  previousState?: Partial<EditorDocument>;
  nextState?: Partial<EditorDocument>;
  
  // Or store canvas snapshots for complex operations
  canvasSnapshot?: ImageData;
}

/**
 * Editor adjustments (brightness, contrast, etc.)
 */
export interface ImageAdjustments {
  brightness: number;        // 0-200, default 100
  contrast: number;          // 0-200, default 100
  saturation: number;        // 0-200, default 100
  hue: number;               // -180 to 180, default 0
  exposure?: number;         // -2 to 2, default 0
  highlights?: number;       // -100 to 100, default 0
  shadows?: number;          // -100 to 100, default 0
  temperature?: number;      // -50 to 50, default 0
  tint?: number;             // -50 to 50, default 0
  vibrance?: number;         // -100 to 100, default 0
  sharpness?: number;        // -100 to 100, default 0
}

/**
 * Background removal settings
 */
export interface BackgroundRemovalSettings {
  sensitivity: number;  // 0-100
  softness: number;     // 0-50
  applied: boolean;
}

/**
 * Crop settings
 */
export interface CropSettings {
  x: number;
  y: number;
  width: number;
  height: number;
  aspectRatio: number | null;  // null for free crop
  aspectRatioName?: string;    // '1:1', '4:3', etc.
}

/**
 * Editor UI state
 */
export interface EditorUIState {
  selectedTool: EditorTool;
  selectedObject: string | null;
  zoom: number;                // Percentage: 25-400
  panX: number;
  panY: number;
  showRulers: boolean;
  showGrid: boolean;
  gridSize: number;
  showRuleOfThirds: boolean;
  sidebarTab: 'properties' | 'layers' | 'adjustments';
  sidebarCollapsed: boolean;
  fullscreenMode: boolean;
}

/**
 * Main editor state
 */
export interface EditorState {
  // Document
  document: EditorDocument | null;
  
  // Current image (source canvas)
  originalImage: HTMLCanvasElement | null;
  currentCanvas: HTMLCanvasElement | null;
  
  // Adjustments
  adjustments: ImageAdjustments;
  
  // Special tools
  backgroundRemoval: BackgroundRemovalSettings;
  crop: CropSettings | null;
  
  // UI
  ui: EditorUIState;
  
  // History
  history: HistoryAction[];
  historyIndex: number;
  
  // File state
  fileName: string;
  hasUnsavedChanges: boolean;
  
  // Brush/Eraser
  brushSize: number;
  brushOpacity: number;
  brushHardness: number;
  brushColor: string;
  eraserSize: number;
  
  // Text tool
  textFontFamily: string;
  textFontSize: number;
  textFontWeight: number;
  textColor: string;
}
