import { useEffect, useState } from 'react';
import {
  Download,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Maximize,
  X,
  Sparkles,
  Keyboard,
  Pointer,
  Crop,
  Brush,
  Type,
  Shapes,
  Sticker,
  Filter,
  Wand2,
  SlidersHorizontal,
  RotateCw,
  Square,
  Sparkles as SparklesAlt,
  Layers3,
  LayoutGrid,
  Share2,
  Palette,
  BadgeCheck,
  Upload,
} from 'lucide-react';
import { useEditorStore, type EditorTool } from '../store/editorStore';

interface EditorTopBarProps {
  onExportClick: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitToScreen: () => void;
  onToggleShortcuts: () => void;
  onUploadClick?: () => void;
}

const toolGroups = [
  {
    label: 'Select',
    tools: [{ id: 'select', label: 'Select', icon: Pointer }],
  },
  {
    label: 'Image',
    tools: [
      { id: 'crop', label: 'Crop', icon: Crop },
      { id: 'resize', label: 'Resize', icon: Maximize },
      { id: 'transform', label: 'Transform', icon: RotateCw },
      { id: 'filter', label: 'Filter', icon: Filter },
      { id: 'background', label: 'Background', icon: Wand2 },
    ],
  },
  {
    label: 'Create',
    tools: [
      { id: 'text', label: 'Text', icon: Type },
      { id: 'draw', label: 'Draw', icon: Brush },
      { id: 'shapes', label: 'Shapes', icon: Shapes },
      { id: 'stickers', label: 'Stickers', icon: Sticker },
      { id: 'frame', label: 'Frame', icon: Square },
    ],
  },
  {
    label: 'Style',
    tools: [
      { id: 'corners', label: 'Corners', icon: SparklesAlt },
      { id: 'effects', label: 'Effects', icon: SparklesAlt },
      { id: 'meme', label: 'Meme', icon: BadgeCheck },
      { id: 'watermark', label: 'Watermark', icon: Palette },
      { id: 'collage', label: 'Collage', icon: LayoutGrid },
    ],
  },
  {
    label: 'Social',
    tools: [
      { id: 'social', label: 'Social', icon: Share2 },
      { id: 'layers', label: 'Layers', icon: Layers3 },
      { id: 'adjust', label: 'Adjust', icon: SlidersHorizontal },
    ],
  },
] as const;

export default function EditorTopBar({
  onExportClick,
  onZoomIn,
  onZoomOut,
  onFitToScreen,
  onToggleShortcuts,
  onUploadClick,
}: EditorTopBarProps) {
  const { documentName, zoom, isDirty, canUndo, canRedo, undo, redo, setZoom, activeTool, setActiveTool } = useEditorStore();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => {
    const closeMenu = () => setActiveMenu(null);
    const listener = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu();
    };

    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, []);

  const handleZoom100 = () => {
    setZoom(100);
    setActiveMenu(null);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex items-center justify-between gap-4 px-4 py-3">
        <div className="flex min-w-0 items-center gap-6">
          <div className="flex flex-shrink-0 items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-white shadow-md">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="text-sm font-semibold tracking-tight text-foreground">ImageCraft Editor</span>
          </div>

          <nav className="hidden items-center gap-1 md:flex">
            <div className="relative">
              <button
                aria-label="File menu"
                onClick={() => setActiveMenu(activeMenu === 'file' ? null : 'file')}
                className="px-3 py-1.5 text-sm font-medium text-foreground-secondary transition hover:text-foreground"
              >
                File
              </button>
              {activeMenu === 'file' && (
                <div className="absolute left-0 top-full z-50 mt-1 w-48 rounded-xl border border-border bg-surface-elevated shadow-lg">
                  <button className="w-full px-4 py-2 text-left text-sm text-foreground transition hover:bg-accent-soft">
                    New
                  </button>
                  <button onClick={onUploadClick} className="w-full px-4 py-2 text-left text-sm text-foreground transition hover:bg-accent-soft flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Image
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-foreground transition hover:bg-accent-soft">
                    Open Image
                  </button>
                  <button
                    onClick={() => {
                      onExportClick();
                      setActiveMenu(null);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-foreground transition hover:bg-accent-soft"
                  >
                    Export
                  </button>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                aria-label="Edit menu"
                onClick={() => setActiveMenu(activeMenu === 'edit' ? null : 'edit')}
                className="px-3 py-1.5 text-sm font-medium text-foreground-secondary transition hover:text-foreground"
              >
                Edit
              </button>
              {activeMenu === 'edit' && (
                <div className="absolute left-0 top-full z-50 mt-1 w-52 rounded-xl border border-border bg-surface-elevated shadow-lg">
                  <button
                    onClick={() => {
                      undo();
                      setActiveMenu(null);
                    }}
                    disabled={!canUndo()}
                    className="w-full px-4 py-2 text-left text-sm text-foreground transition hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Undo — Ctrl+Z
                  </button>
                  <button
                    onClick={() => {
                      redo();
                      setActiveMenu(null);
                    }}
                    disabled={!canRedo()}
                    className="w-full px-4 py-2 text-left text-sm text-foreground transition hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Redo — Ctrl+Shift+Z
                  </button>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                aria-label="View menu"
                onClick={() => setActiveMenu(activeMenu === 'view' ? null : 'view')}
                className="px-3 py-1.5 text-sm font-medium text-foreground-secondary transition hover:text-foreground"
              >
                View
              </button>
              {activeMenu === 'view' && (
                <div className="absolute left-0 top-full z-50 mt-1 w-52 rounded-xl border border-border bg-surface-elevated shadow-lg">
                  <button
                    onClick={() => {
                      onZoomIn();
                      setActiveMenu(null);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-foreground transition hover:bg-accent-soft"
                  >
                    Zoom In
                  </button>
                  <button
                    onClick={() => {
                      onZoomOut();
                      setActiveMenu(null);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-foreground transition hover:bg-accent-soft"
                  >
                    Zoom Out
                  </button>
                  <button
                    onClick={() => {
                      onFitToScreen();
                      setActiveMenu(null);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-foreground transition hover:bg-accent-soft"
                  >
                    Fit to screen
                  </button>
                  <button
                    onClick={handleZoom100}
                    className="w-full px-4 py-2 text-left text-sm text-foreground transition hover:bg-accent-soft"
                  >
                    100%
                  </button>
                  <button
                    onClick={() => {
                      onToggleShortcuts();
                      setActiveMenu(null);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-foreground transition hover:bg-accent-soft"
                  >
                    Keyboard Shortcuts
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>

        <div className="flex-1 text-center">
          <h1 className="truncate text-sm font-semibold text-foreground">
            {documentName}
            {isDirty && <span className="ml-2 text-foreground-muted">●</span>}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            aria-label="Undo last action"
            onClick={undo}
            disabled={!canUndo()}
            title="Undo last action — Ctrl+Z"
            className="rounded-lg border border-border p-2 text-foreground-secondary transition hover:bg-surface-elevated hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Undo2 className="h-4 w-4" />
          </button>
          <button
            aria-label="Redo last action"
            onClick={redo}
            disabled={!canRedo()}
            title="Redo last action — Ctrl+Shift+Z"
            className="rounded-lg border border-border p-2 text-foreground-secondary transition hover:bg-surface-elevated hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Redo2 className="h-4 w-4" />
          </button>

          <div className="ml-2 hidden items-center gap-2 border-l border-border pl-2 md:flex">
            <button
              aria-label="Zoom out"
              onClick={onZoomOut}
              title="Zoom out"
              className="rounded-lg p-2 text-foreground-secondary transition hover:bg-surface-elevated hover:text-foreground"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="min-w-[3rem] text-center text-sm font-medium text-foreground">{Math.round(zoom)}%</span>
            <button
              aria-label="Zoom in"
              onClick={onZoomIn}
              title="Zoom in"
              className="rounded-lg p-2 text-foreground-secondary transition hover:bg-surface-elevated hover:text-foreground"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
          </div>

          <button
            aria-label="Fit image to screen"
            onClick={onFitToScreen}
            title="Fit image to screen"
            className="rounded-lg border border-border p-2 text-foreground-secondary transition hover:bg-surface-elevated hover:text-foreground"
          >
            <Maximize className="h-4 w-4" />
          </button>

          <button
            aria-label="Keyboard shortcuts"
            onClick={onToggleShortcuts}
            title="Keyboard shortcuts"
            className="rounded-lg border border-border p-2 text-foreground-secondary transition hover:bg-surface-elevated hover:text-foreground"
          >
            <Keyboard className="h-4 w-4" />
          </button>

          <button
            aria-label="Export image"
            onClick={onExportClick}
            title="Export image"
            className="rounded-lg border border-border p-2 text-foreground-secondary transition hover:bg-surface-elevated hover:text-foreground"
          >
            <Download className="h-4 w-4" />
          </button>

          <button
            aria-label="Close editor"
            title="Close editor"
            className="rounded-lg border border-border p-2 text-foreground-secondary transition hover:bg-surface-elevated hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="border-t border-border/50 bg-gradient-to-r from-surface-muted via-surface to-surface-muted">
        <div className="flex gap-2 overflow-x-auto px-3 py-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border">
          {toolGroups.flatMap((group) =>
            group.tools.map((tool) => {
              const Icon = tool.icon;
              const isActive = activeTool === tool.id;

              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => setActiveTool(tool.id as EditorTool)}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-bold whitespace-nowrap transition active:scale-95 ${
                    isActive
                      ? 'border-accent bg-gradient-to-r from-accent to-accent/80 text-white shadow-[0_12px_28px_rgba(91,95,239,0.25)] hover:shadow-[0_16px_36px_rgba(91,95,239,0.25)]'
                      : 'border-border/40 bg-gradient-to-r from-surface to-surface/80 text-foreground-secondary hover:border-accent/40 hover:text-foreground hover:from-surface-elevated'
                  }`}
                  title={tool.label}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tool.label}</span>
                </button>
              );
            }),
          )}
        </div>
      </div>
    </header>
  );
}
