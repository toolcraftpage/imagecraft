import { Eye, Unlock } from 'lucide-react';

export default function LayersPanel() {
  return (
    <div className="p-4 space-y-2">
      <div className="text-sm font-medium text-foreground-muted mb-3">Layers (1)</div>

      {/* Background Layer */}
      <div className="flex items-center gap-2 p-2 rounded-lg bg-surface-elevated border border-border hover:border-accent/50 transition">
        <div className="h-10 w-10 bg-background rounded border border-border flex items-center justify-center text-xs text-foreground-muted">
          BG
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">Background</p>
          <p className="text-xs text-foreground-secondary">Image Layer</p>
        </div>
        <button className="p-1.5 text-foreground-secondary hover:text-foreground transition" title="Toggle visibility">
          <Eye className="h-4 w-4" />
        </button>
        <button className="p-1.5 text-foreground-secondary hover:text-foreground transition" title="Lock layer">
          <Unlock className="h-4 w-4" />
        </button>
      </div>

      <div className="pt-3 border-t border-border mt-3">
        <p className="text-xs text-foreground-muted mb-2">Layer Opacity</p>
        <input
          type="range"
          min="0"
          max="100"
          defaultValue="100"
          className="w-full"
        />
      </div>
    </div>
  );
}
