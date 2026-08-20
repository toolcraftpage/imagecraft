import { RotateCcw, RotateCw, FlipHorizontal, FlipVertical } from 'lucide-react';

interface TransformToolProps {
  onRotateLeft?: () => void;
  onRotateRight?: () => void;
  onFlipHorizontal?: () => void;
  onFlipVertical?: () => void;
}

export default function TransformTool({
  onRotateLeft = () => undefined,
  onRotateRight = () => undefined,
  onFlipHorizontal = () => undefined,
  onFlipVertical = () => undefined,
}: TransformToolProps) {
  return (
    <div className="space-y-4 p-5">
      <div className="rounded-xl border border-accent/20 bg-gradient-to-br from-accent-soft to-accent-soft/50 p-4 shadow-sm">
        <p className="text-sm font-bold bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent">Transform Controls</p>
        <p className="text-xs text-foreground-secondary/70 mt-1">Rotate and flip your image</p>
      </div>
      <div className="space-y-3">
        <button 
          type="button" 
          onClick={onRotateLeft} 
          className="group flex w-full items-center justify-center gap-2 rounded-xl border border-blue-300/40 bg-gradient-to-r from-blue-500/10 to-blue-600/10 px-4 py-3 text-sm font-medium text-blue-700 transition hover:border-blue-400/60 hover:from-blue-500/20 hover:to-blue-600/20 active:scale-95 shadow-sm hover:shadow-md"
        >
          <RotateCcw className="h-5 w-5 transition group-hover:scale-110" />
          Rotate Left (90°)
        </button>
        <button 
          type="button" 
          onClick={onRotateRight} 
          className="group flex w-full items-center justify-center gap-2 rounded-xl border border-purple-300/40 bg-gradient-to-r from-purple-500/10 to-purple-600/10 px-4 py-3 text-sm font-medium text-purple-700 transition hover:border-purple-400/60 hover:from-purple-500/20 hover:to-purple-600/20 active:scale-95 shadow-sm hover:shadow-md"
        >
          <RotateCw className="h-5 w-5 transition group-hover:scale-110" />
          Rotate Right (90°)
        </button>
        <button 
          type="button" 
          onClick={onFlipHorizontal} 
          className="group flex w-full items-center justify-center gap-2 rounded-xl border border-green-300/40 bg-gradient-to-r from-green-500/10 to-green-600/10 px-4 py-3 text-sm font-medium text-green-700 transition hover:border-green-400/60 hover:from-green-500/20 hover:to-green-600/20 active:scale-95 shadow-sm hover:shadow-md"
        >
          <FlipHorizontal className="h-5 w-5 transition group-hover:scale-110" />
          Flip Horizontal
        </button>
        <button 
          type="button" 
          onClick={onFlipVertical} 
          className="group flex w-full items-center justify-center gap-2 rounded-xl border border-orange-300/40 bg-gradient-to-r from-orange-500/10 to-orange-600/10 px-4 py-3 text-sm font-medium text-orange-700 transition hover:border-orange-400/60 hover:from-orange-500/20 hover:to-orange-600/20 active:scale-95 shadow-sm hover:shadow-md"
        >
          <FlipVertical className="h-5 w-5 transition group-hover:scale-110" />
          Flip Vertical
        </button>
      </div>
    </div>
  );
}
