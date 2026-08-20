import { Brush, Eraser } from 'lucide-react';

export default function DrawTool() {
  return (
    <div className="space-y-4 p-5">
      <div className="rounded-xl border border-lime-200/40 bg-gradient-to-br from-lime-50/10 to-green-50/10 p-4 shadow-sm">
        <div className="flex items-center gap-3 text-foreground">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-lime-500/20 to-green-500/20">
            <Brush className="h-5 w-5 text-lime-600" />
          </div>
          <span className="text-base font-bold bg-gradient-to-r from-lime-600 to-green-600 bg-clip-text text-transparent">Paint & Draw</span>
        </div>
      </div>
      <div className="space-y-3">
        <div className="rounded-xl border border-dashed border-lime-300/40 bg-gradient-to-br from-lime-50/20 to-green-50/20 p-5 text-sm text-foreground-secondary shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 mt-1">
              <span className="text-xs font-bold text-amber-600">🎨</span>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">Brush tool coming soon!</p>
              <p className="text-xs text-foreground-secondary/70">Draw and paint directly on your canvas with full brush customization including size, opacity, and color blending.</p>
            </div>
          </div>
        </div>
        
        <div className="rounded-xl border border-lime-200/40 bg-gradient-to-br from-lime-50/10 to-green-50/10 p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-red-500/20 to-pink-500/20">
              <Eraser className="h-4 w-4 text-red-600" />
            </div>
            <span className="text-sm font-bold text-red-700">Eraser tool</span>
          </div>
          <p className="text-xs text-foreground-secondary/70">Clean up your artwork with precision erasing at various opacity levels.</p>
        </div>
      </div>
      
      <div className="rounded-xl border border-lime-300/40 bg-gradient-to-r from-lime-500/10 to-green-500/10 p-4">
        <p className="text-xs text-center text-lime-700 font-semibold">✓ Enabled in Editor</p>
      </div>
    </div>
  );
}
