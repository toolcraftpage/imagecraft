import { useEffect, useRef } from 'react';
import { useAds } from './AdProvider';
import { Megaphone, ArrowRight } from 'lucide-react';

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>> & { push: (...items: Record<string, unknown>[]) => number };
  }
}

interface AdSlotProps {
  size?: 'leaderboard' | 'sidebar' | 'inline' | 'responsive';
  className?: string;
}

const sizeMap = {
  leaderboard: { width: 728, height: 90 },
  sidebar: { width: 300, height: 250 },
  inline: { width: 300, height: 250 },
  responsive: { width: '100%', height: 'auto' },
};

export default function AdSlot({ size = 'sidebar', className = '' }: AdSlotProps) {
  const { adsEnabled, adsConfigured } = useAds();
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    if (adsEnabled && adRef.current && window.adsbygoogle) {
      try {
        window.adsbygoogle.push({});
      } catch (e) {
        console.error('AdSense error:', e);
      }
    }
  }, [adsEnabled]);

  if (!adsEnabled || !adsConfigured) {
    return (
      <div
        className={`relative overflow-hidden rounded-xl border border-border bg-[linear-gradient(135deg,rgba(91,95,239,0.08),rgba(124,58,237,0.06),rgba(15,23,42,0.02))] p-5 shadow-[var(--shadow-sm)] ${className}`}
        style={{ minHeight: sizeMap[size].height || 100 }}
      >
        <div className="absolute -top-4 -right-4 h-16 w-16 rounded-full bg-accent-soft" />
        <div className="absolute -bottom-4 -left-4 h-12 w-12 rounded-full bg-surface-muted" />

        <div className="relative flex h-full flex-col items-center justify-center gap-3 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface-elevated shadow-sm">
            <Megaphone size={20} className="text-accent" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">A calm space for sponsors</p>
            <p className="mt-1 max-w-[180px] text-xs text-foreground-secondary">
              Ads stay clearly labeled and never interrupt your workflow.
            </p>
          </div>
          <a
            href="mailto:ads@imagecraft.com"
            className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:text-accent-hover hover:underline"
          >
            Sponsor a placement <ArrowRight size={12} />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center overflow-hidden rounded-lg border border-border bg-surface-muted ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', width: sizeMap[size].width, height: sizeMap[size].height }}
        data-ad-client={import.meta.env.VITE_ADSENSE_CLIENT}
        data-ad-slot={import.meta.env.VITE_ADSENSE_SLOT || undefined}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}