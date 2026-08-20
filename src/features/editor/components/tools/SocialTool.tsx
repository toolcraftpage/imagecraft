import { Share2 } from 'lucide-react';

export default function SocialTool() {
  const presets = [
    { name: 'Instagram Square', ratio: '1:1', emoji: '📱' },
    { name: 'Story', ratio: '9:16', emoji: '🎬' },
    { name: 'LinkedIn', ratio: '1.91:1', emoji: '💼' },
    { name: 'Poster', ratio: '4:5', emoji: '📺' },
  ];

  return (
    <div className="space-y-5 p-5">
      <div className="rounded-xl border border-violet-200/40 bg-gradient-to-br from-violet-50/10 to-purple-50/10 p-4 shadow-sm">
        <div className="flex items-center gap-3 text-foreground">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/20 to-purple-500/20">
            <Share2 className="h-5 w-5 text-violet-600" />
          </div>
          <span className="text-base font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">Social Presets</span>
        </div>
      </div>

      <div className="space-y-2 rounded-xl border border-violet-200/40 bg-gradient-to-br from-violet-50/10 to-purple-50/10 p-5 shadow-sm">
        {presets.map((preset) => (
          <div key={preset.name} className="flex items-center justify-between rounded-lg border border-violet-300/40 bg-gradient-to-r from-violet-50/40 to-purple-50/30 px-4 py-3 transition hover:border-violet-400/60 hover:from-violet-100/40">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-xl">{preset.emoji}</span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-violet-700 truncate">{preset.name}</p>
                <p className="text-xs text-violet-600/70">Aspect {preset.ratio}</p>
              </div>
            </div>
            <button className="flex-shrink-0 px-3 py-1.5 bg-gradient-to-r from-violet-500 to-purple-500 text-white text-xs font-bold rounded-lg hover:from-violet-600 hover:to-purple-600 transition active:scale-95">Use</button>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-cyan-300/40 bg-gradient-to-br from-cyan-50/20 to-teal-50/20 p-4">
        <p className="text-xs text-center text-cyan-700 font-semibold">🚀 Optimize your images for social media platforms</p>
      </div>
    </div>
  );
}
