import type { ReactNode } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface AdContainerProps {
  children?: ReactNode;
  className?: string;
  size?: 'sidebar' | 'leaderboard' | 'inline';
  label?: string;
}

const sizeStyles = {
  sidebar: 'w-full max-w-[300px] min-h-[250px]',
  leaderboard: 'w-full max-w-[728px] min-h-[90px]',
  inline: 'w-full max-w-[320px] min-h-[220px]',
};

export default function AdContainer({
  children,
  className,
  size = 'sidebar',
  label = 'Sponsored',
}: AdContainerProps) {
  return (
    <div
      className={twMerge(
        clsx(
          'relative overflow-hidden rounded-[22px] border border-border bg-surface-elevated/90 p-3 shadow-[var(--shadow-sm)] backdrop-blur-sm',
          sizeStyles[size],
          className,
        ),
      )}
      aria-label={`${label} ad placement`}
      role="complementary"
    >
      <div className="mb-2 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground-muted">
        <span>{label}</span>
        <span className="rounded-full border border-border bg-surface px-1.5 py-0.5 text-[9px] font-medium text-foreground-secondary">
          Ad
        </span>
      </div>

      <div className="flex min-h-[180px] items-center justify-center overflow-hidden rounded-[18px] border border-dashed border-border bg-[radial-gradient(circle_at_top,_rgba(91,95,239,0.08),_transparent_55%)]">
        {children ?? (
          <div className="flex flex-col items-center justify-center gap-3 px-4 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-accent shadow-[var(--shadow-sm)]">
              <span className="text-base font-semibold">◎</span>
            </div>

            <div>
                <p className="text-sm font-semibold text-foreground">Sponsored space</p>
              <p className="mt-1 max-w-[220px] text-xs leading-5 text-muted">
                Clearly labeled placements help keep ImageCraft free.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
