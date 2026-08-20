import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  className?: string;
}

export default function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <div
      className={twMerge(
        clsx(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
          {
            'bg-surface-muted text-foreground-secondary': variant === 'default',
            'bg-accent-soft text-accent': variant === 'primary',
            'bg-success-soft text-success': variant === 'success',
            'bg-warning-soft text-warning': variant === 'warning',
            'bg-error-soft text-error': variant === 'danger',
          },
          className,
        ),
      )}
    >
      {children}
    </div>
  );
}