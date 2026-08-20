import { AnimatePresence, motion } from 'framer-motion';
import { Crop, Filter, Image as ImageIcon, Maximize2, Paintbrush2, Brush, RotateCcw, Shapes, SlidersHorizontal, Type, Wand2, Sticker, Square, Sparkles, LayoutGrid, Share2, Layers3, Palette, BadgeCheck } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';
import type { CropAspect, CropRect } from './tools/CropTool';
import CropTool from './tools/CropTool';
import AdjustmentsTool from './tools/AdjustmentsTool';
import BackgroundTool from './tools/BackgroundTool';
import DrawTool from './tools/DrawTool';
import ResizeTool from './tools/ResizeTool';
import TextTool from './tools/TextTool';
import TransformTool from './tools/TransformTool';
import FilterTool from './tools/FilterTool';
import ShapeTool from './tools/ShapeTool';
import StickerTool from './tools/StickerTool';
import FrameTool from './tools/FrameTool';
import CornersTool from './tools/CornersTool';
import EffectsTool from './tools/EffectsTool';
import MemeTool from './tools/MemeTool';
import WatermarkTool from './tools/WatermarkTool';
import CollageTool from './tools/CollageTool';
import SocialTool from './tools/SocialTool';
import LayersTool from './tools/LayersTool';

interface ToolPanelProps {
  previewUrl?: string | null;
  brightness?: number;
  contrast?: number;
  saturation?: number;
  hue?: number;
  bgTolerance?: number;
  bgSoftness?: number;
  isProcessing?: boolean;
  cropSelection?: CropRect | null;
  cropAspect?: CropAspect;
  onBrightnessChange?: (value: number) => void;
  onContrastChange?: (value: number) => void;
  onSaturationChange?: (value: number) => void;
  onHueChange?: (value: number) => void;
  onBgToleranceChange?: (value: number) => void;
  onBgSoftnessChange?: (value: number) => void;
  onResetAdjustment?: () => void;
  onResetAll?: () => void;
  onApplyBackgroundRemoval?: () => void;
  onRotateLeft?: () => void;
  onRotateRight?: () => void;
  onFlipHorizontal?: () => void;
  onFlipVertical?: () => void;
  onCropAspectChange?: (aspect: CropAspect) => void;
  onCropWidthChange?: (value: number) => void;
  onCropHeightChange?: (value: number) => void;
  onCropCancel?: () => void;
  onCropApply?: () => void;
}

const toolHeader = {
  crop: { label: 'Crop', description: 'Crop your image', icon: Crop },
  text: { label: 'Text', description: 'Add and style text', icon: Type },
  adjust: { label: 'Adjust', description: 'Fine-tune tones', icon: SlidersHorizontal },
  transform: { label: 'Transform', description: 'Rotate and flip', icon: RotateCcw },
  resize: { label: 'Resize', description: 'Change image size', icon: Maximize2 },
  brush: { label: 'Draw', description: 'Paint on the canvas', icon: Paintbrush2 },
  draw: { label: 'Draw', description: 'Paint on the canvas', icon: Brush },
  shapes: { label: 'Shapes', description: 'Add vector shapes', icon: Shapes },
  stickers: { label: 'Stickers', description: 'Layer icons and emoji', icon: Sticker },
  frame: { label: 'Frame', description: 'Add a polished border', icon: Square },
  corners: { label: 'Corners', description: 'Round image corners', icon: Sparkles },
  filter: { label: 'Filter', description: 'Apply creative looks', icon: Filter },
  filters: { label: 'Filters', description: 'Apply creative looks', icon: Filter },
  background: { label: 'Background', description: 'Remove background', icon: Wand2 },
  'background-remover': { label: 'Background', description: 'Remove background', icon: Wand2 },
  effects: { label: 'Effects', description: 'Vignette and glow', icon: Palette },
  meme: { label: 'Meme', description: 'Add meme text layers', icon: BadgeCheck },
  watermark: { label: 'Watermark', description: 'Add branded overlays', icon: Palette },
  collage: { label: 'Collage', description: 'Compose a collage', icon: LayoutGrid },
  social: { label: 'Social', description: 'Export presets', icon: Share2 },
  layers: { label: 'Layers', description: 'Manage layer stack', icon: Layers3 },
  select: { label: 'Document', description: 'Editor overview', icon: ImageIcon },
} as const;

export default function ToolPanel({
  previewUrl = null,
  brightness = 100,
  contrast = 100,
  saturation = 100,
  hue = 0,
  bgTolerance = 42,
  bgSoftness = 2,
  isProcessing = false,
  cropSelection = null,
  cropAspect = 'free',
  onBrightnessChange,
  onContrastChange,
  onSaturationChange,
  onHueChange,
  onBgToleranceChange,
  onBgSoftnessChange,
  onResetAdjustment,
  onResetAll,
  onApplyBackgroundRemoval,
  onRotateLeft,
  onRotateRight,
  onFlipHorizontal,
  onFlipVertical,
  onCropAspectChange,
  onCropWidthChange,
  onCropHeightChange,
  onCropCancel,
  onCropApply,
}: ToolPanelProps) {
  const { activeTool, zoom, documentName } = useEditorStore();
  const selected = toolHeader[activeTool as keyof typeof toolHeader] ?? toolHeader.select;
  const Icon = selected.icon;

  const content = (() => {
    switch (activeTool) {
      case 'crop':
        return (
          <CropTool
            crop={cropSelection}
            aspect={cropAspect}
            onAspectChange={onCropAspectChange ?? (() => undefined)}
            onWidthChange={onCropWidthChange ?? (() => undefined)}
            onHeightChange={onCropHeightChange ?? (() => undefined)}
            onCancel={onCropCancel ?? (() => undefined)}
            onApply={onCropApply ?? (() => undefined)}
            onResetAspect={() => onCropAspectChange?.('free')}
          />
        );
      case 'text':
        return <TextTool />;
      case 'adjust':
        return (
          <AdjustmentsTool
            brightness={brightness}
            contrast={contrast}
            saturation={saturation}
            hue={hue}
            bgTolerance={bgTolerance}
            bgSoftness={bgSoftness}
            isProcessing={isProcessing}
            onBrightnessChange={onBrightnessChange}
            onContrastChange={onContrastChange}
            onSaturationChange={onSaturationChange}
            onHueChange={onHueChange}
            onBgToleranceChange={onBgToleranceChange}
            onBgSoftnessChange={onBgSoftnessChange}
            onResetAdjustment={onResetAdjustment}
            onResetAll={onResetAll}
            onApplyBackgroundRemoval={onApplyBackgroundRemoval}
            onRotateLeft={onRotateLeft}
            onRotateRight={onRotateRight}
            onFlipHorizontal={onFlipHorizontal}
            onFlipVertical={onFlipVertical}
          />
        );
      case 'filter':
      case 'filters':
        return <FilterTool brightness={brightness} contrast={contrast} saturation={saturation} hue={hue} onBrightnessChange={onBrightnessChange ?? (() => undefined)} onContrastChange={onContrastChange ?? (() => undefined)} onSaturationChange={onSaturationChange ?? (() => undefined)} onHueChange={onHueChange ?? (() => undefined)} />;
      case 'draw':
      case 'brush':
        return <DrawTool />;
      case 'transform':
        return <TransformTool onRotateLeft={onRotateLeft} onRotateRight={onRotateRight} onFlipHorizontal={onFlipHorizontal} onFlipVertical={onFlipVertical} />;
      case 'resize':
        return <ResizeTool width={1200} height={800} onWidthChange={onCropWidthChange ?? (() => undefined)} onHeightChange={onCropHeightChange ?? (() => undefined)} />;
      case 'background':
      case 'background-remover':
        return (
          <BackgroundTool
            bgTolerance={bgTolerance}
            bgSoftness={bgSoftness}
            isProcessing={isProcessing}
            onBgToleranceChange={onBgToleranceChange}
            onBgSoftnessChange={onBgSoftnessChange}
            onApplyBackgroundRemoval={onApplyBackgroundRemoval}
          />
        );
      case 'shapes':
        return <ShapeTool />;
      case 'stickers':
        return <StickerTool />;
      case 'frame':
        return <FrameTool />;
      case 'corners':
        return <CornersTool />;
      case 'effects':
        return <EffectsTool />;
      case 'meme':
        return <MemeTool />;
      case 'watermark':
        return <WatermarkTool />;
      case 'collage':
        return <CollageTool />;
      case 'social':
        return <SocialTool />;
      case 'layers':
        return <LayersTool />;
      default:
        return (
          <div className="space-y-4 p-4">
            <div className="rounded-xl border border-border bg-surface-muted p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground-muted">ImageCraft</p>
              <p className="mt-3 text-sm font-medium text-foreground">Select a tool to begin</p>
            </div>
            {previewUrl && (
              <div className="overflow-hidden rounded-xl border border-border bg-surface-muted">
                <img src={previewUrl} alt="Current preview" className="h-32 w-full object-cover" />
              </div>
            )}
            <div className="space-y-2 rounded-xl border border-border bg-surface-muted p-3 text-sm text-foreground-secondary">
              <div className="flex items-center justify-between"><span>Canvas</span><span>Ready</span></div>
              <div className="flex items-center justify-between"><span>Zoom</span><span>{Math.round(zoom)}%</span></div>
              <div className="flex items-center justify-between"><span>Document</span><span>{documentName}</span></div>
            </div>
          </div>
        );
    }
  })();

  return (
    <aside className="hidden w-[380px] flex-col border-r border-border/50 bg-gradient-to-b from-surface via-surface to-surface-muted lg:flex shadow-lg">
      <div className="border-b border-border/30 bg-gradient-to-r from-surface-elevated via-accent-soft/5 to-surface-elevated px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent/80 text-white shadow-lg">
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-base font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">{selected.label}</p>
            <p className="truncate text-xs text-foreground-secondary/80">{selected.description}</p>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTool}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-accent/30 scrollbar-track-transparent"
        >
          {content}
        </motion.div>
      </AnimatePresence>
    </aside>
  );
}
