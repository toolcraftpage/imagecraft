import { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={twMerge(
          clsx(
            'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
            {
              'bg-accent text-accent-foreground shadow-[0_12px_30px_rgba(91,95,239,0.22)] hover:bg-accent-hover active:translate-y-0.5': variant === 'primary',
              'border border-border bg-surface text-foreground hover:-translate-y-0.5 hover:border-accent/40 hover:bg-surface-elevated': variant === 'secondary',
              'text-foreground hover:bg-surface-elevated': variant === 'ghost',
              'px-3 py-1.5 text-sm': size === 'sm',
              'px-4 py-2.5 text-sm': size === 'md',
              'px-5 py-3 text-base': size === 'lg',
            },
            className,
          ),
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
export default Button;