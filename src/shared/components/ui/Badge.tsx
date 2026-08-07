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
            'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200': variant === 'default',
            'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200': variant === 'primary',
            'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200': variant === 'success',
            'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200': variant === 'warning',
            'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200': variant === 'danger',
          },
          className,
        ),
      )}
    >
      {children}
    </div>
  );
}