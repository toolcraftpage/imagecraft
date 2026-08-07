import { useEffect, useRef } from 'react';
import { useAds } from './AdProvider';
import { Megaphone, ArrowRight } from 'lucide-react';

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
  const { adsEnabled } = useAds();
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    if (adsEnabled && adRef.current && (window as any).adsbygoogle) {
      try {
        (window as any).adsbygoogle.push({});
      } catch (e) {
        console.error('AdSense error:', e);
      }
    }
  }, [adsEnabled]);

  // ----- Beautiful placeholder when ads are disabled -----
  if (!adsEnabled) {
    return (
      <div
        className={`relative overflow-hidden rounded-xl bg-gradient-to-br from-primary-50 to-accent-50 p-5 shadow-inner dark:from-gray-700 dark:to-gray-800 ${className}`}
        style={{ minHeight: sizeMap[size].height || 100 }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-4 -right-4 h-16 w-16 rounded-full bg-primary-200/40 dark:bg-primary-500/10" />
        <div className="absolute -bottom-4 -left-4 h-12 w-12 rounded-full bg-accent-200/40 dark:bg-accent-500/10" />

        <div className="relative flex flex-col items-center justify-center h-full text-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 dark:bg-gray-600/50 shadow-sm">
            <Megaphone size={20} className="text-primary-500 dark:text-primary-300" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              Advertise with us
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 max-w-[180px]">
              Reach thousands of designers and developers
            </p>
          </div>
          <a
            href="mailto:ads@imagecraft.com"
            className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline"
          >
            Get started <ArrowRight size={12} />
          </a>
        </div>
      </div>
    );
  }

  // ----- Real AdSense unit (replace IDs with your own) -----
  return (
    <div className={`flex items-center justify-center overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', width: sizeMap[size].width, height: sizeMap[size].height }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"   // ← Replace with your AdSense ID
        data-ad-slot="1234567890"                   // ← Replace with your ad unit ID
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}