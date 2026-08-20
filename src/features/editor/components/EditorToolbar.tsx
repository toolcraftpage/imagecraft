import {
  Pointer,
  Crop,
  Brush,
  Type,
  Shapes,
  Sticker,
  Filter,
  Wand2,
  SlidersHorizontal,
  Maximize,
  RotateCw,
  Square,
  Sparkles,
  Layers3,
  LayoutGrid,
  Share2,
  Palette,
  BadgeCheck,
} from 'lucide-react';
import { useEditorStore, type EditorTool } from '../store/editorStore';

interface ToolGroup {
  label: string;
  tools: { id: EditorTool; label: string; icon: React.ReactNode; shortcut?: string; description?: string }[];
}

const toolGroups: ToolGroup[] = [
  {
    label: 'Select',
    tools: [{ id: 'select', label: 'Select', icon: <Pointer className="h-4 w-4" />, shortcut: 'V' }],
  },
  {
    label: 'Image',
    tools: [
      { id: 'crop', label: 'Crop', icon: <Crop className="h-4 w-4" />, shortcut: 'C', description: 'Crop and trim' },
      { id: 'resize', label: 'Resize', icon: <Maximize className="h-4 w-4" />, description: 'Resize canvas' },
      { id: 'transform', label: 'Transform', icon: <RotateCw className="h-4 w-4" />, description: 'Rotate and flip' },
      { id: 'filter', label: 'Filter', icon: <Filter className="h-4 w-4" />, description: 'Adjust image look' },
      { id: 'background', label: 'Background', icon: <Wand2 className="h-4 w-4" />, description: 'Remove background' },
    ],
  },
  {
    label: 'Create',
    tools: [
      { id: 'text', label: 'Text', icon: <Type className="h-4 w-4" />, shortcut: 'T', description: 'Add text' },
      { id: 'draw', label: 'Draw', icon: <Brush className="h-4 w-4" />, shortcut: 'B', description: 'Paint details' },
      { id: 'shapes', label: 'Shapes', icon: <Shapes className="h-4 w-4" />, description: 'Add shapes' },
      { id: 'stickers', label: 'Stickers', icon: <Sticker className="h-4 w-4" />, description: 'Add emoji or marks' },
      { id: 'frame', label: 'Frame', icon: <Square className="h-4 w-4" />, description: 'Add border frame' },
    ],
  },
  {
    label: 'Style',
    tools: [
      { id: 'corners', label: 'Corners', icon: <Sparkles className="h-4 w-4" />, description: 'Round corners' },
      { id: 'effects', label: 'Effects', icon: <Sparkles className="h-4 w-4" />, description: 'Vignette and glow' },
      { id: 'meme', label: 'Meme', icon: <BadgeCheck className="h-4 w-4" />, description: 'Add meme text' },
      { id: 'watermark', label: 'Watermark', icon: <Palette className="h-4 w-4" />, description: 'Add branded mark' },
      { id: 'collage', label: 'Collage', icon: <LayoutGrid className="h-4 w-4" />, description: 'Compose a collage' },
    ],
  },
  {
    label: 'Social',
    tools: [
      { id: 'social', label: 'Social', icon: <Share2 className="h-4 w-4" />, description: 'Preset exports' },
      { id: 'layers', label: 'Layers', icon: <Layers3 className="h-4 w-4" />, description: 'Manage layer stack' },
      { id: 'adjust', label: 'Adjust', icon: <SlidersHorizontal className="h-4 w-4" />, description: 'Tonal controls' },
    ],
  },
];

export default function EditorToolbar() {
  const { activeTool, setActiveTool } = useEditorStore();

  return (
    <aside className="hidden md:flex flex-col w-24 bg-surface border-r border-border overflow-y-auto">
      <div className="flex flex-col gap-4 p-3">
        {toolGroups.map((group) => (
          <div key={group.label} className="flex flex-col gap-1">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-foreground-muted px-2">
              {group.label}
            </p>
            <div className="flex flex-col gap-1">
              {group.tools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  title={`${tool.label}${tool.shortcut ? ` (${tool.shortcut})` : ''}${tool.description ? ` — ${tool.description}` : ''}`}
                  aria-label={`${tool.label}${tool.description ? `: ${tool.description}` : ''}`}
                  className={`
                    flex items-center justify-center p-2 rounded-lg transition
                    ${
                      activeTool === tool.id
                        ? 'bg-accent text-white shadow-md ring-2 ring-accent/30'
                        : 'text-foreground-secondary hover:text-foreground hover:bg-surface-elevated'
                    }
                  `}
                >
                  {tool.icon}
                </button>
              ))}
            </div>
            {group !== toolGroups[toolGroups.length - 1] && <div className="h-px bg-border my-1" />}
          </div>
        ))}
      </div>
    </aside>
  );
}
