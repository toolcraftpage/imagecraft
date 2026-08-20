import { Maximize2 } from 'lucide-react';

interface ResizeToolProps {
  width?: number;
  height?: number;
  onWidthChange?: (value: number) => void;
  onHeightChange?: (value: number) => void;
}

export default function ResizeTool({
  width = 1200,
  height = 800,
  onWidthChange = () => undefined,
  onHeightChange = () => undefined,
}: ResizeToolProps) {
  return (
    <div className="space-y-5 p-5">
      <div className="rounded-xl border border-sky-200/40 bg-gradient-to-br from-sky-50/10 to-blue-50/10 p-4 shadow-sm">
        <div className="flex items-center gap-3 text-foreground">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500/20 to-blue-500/20">
            <Maximize2 className="h-5 w-5 text-sky-600" />
          </div>
          <span className="text-base font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">Resize Image</span>
        </div>
      </div>

      <div className="space-y-4 rounded-xl border border-sky-200/40 bg-gradient-to-br from-sky-50/10 to-blue-50/10 p-5 shadow-sm">
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-xs font-bold uppercase tracking-[0.14em] text-sky-600">
            Width (px)
            <input 
              type="number" 
              min={1} 
              value={Math.round(width)} 
              onChange={(event) => onWidthChange(Number(event.target.value))} 
              className="mt-2 w-full rounded-xl border border-sky-200/40 bg-gradient-to-r from-sky-50/30 to-blue-50/30 px-3 py-2.5 text-sm font-medium text-foreground outline-none focus:border-sky-400/60 focus:ring-2 focus:ring-sky-500/20 transition" 
            />
          </label>
          <label className="block text-xs font-bold uppercase tracking-[0.14em] text-blue-600">
            Height (px)
            <input 
              type="number" 
              min={1} 
              value={Math.round(height)} 
              onChange={(event) => onHeightChange(Number(event.target.value))} 
              className="mt-2 w-full rounded-xl border border-blue-200/40 bg-gradient-to-r from-blue-50/30 to-cyan-50/30 px-3 py-2.5 text-sm font-medium text-foreground outline-none focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/20 transition" 
            />
          </label>
        </div>

        <div className="rounded-lg border border-purple-300/40 bg-gradient-to-r from-purple-50/30 to-pink-50/30 p-3">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-purple-600 mb-1">Current Dimensions</p>
          <p className="text-lg font-bold text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text">
            {width} × {height} px
          </p>
          <p className="text-xs text-purple-600/70 mt-1">
            Aspect Ratio: {(width / height).toFixed(2)}:1
          </p>
        </div>

        <div className="rounded-lg border border-cyan-300/40 bg-gradient-to-r from-cyan-50/30 to-teal-50/30 p-3">
          <p className="text-xs text-cyan-700 font-semibold">💡 Tip: Maintain aspect ratio for best quality</p>
        </div>
      </div>
    </div>
  );
}
