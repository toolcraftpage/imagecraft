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
            'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2',
            {
              'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 shadow-md': variant === 'primary',
              'bg-surface text-gray-900 border border-gray-200 hover:bg-surface-alt dark:bg-surface dark:text-gray-100 dark:border-gray-600 dark:hover:bg-gray-700': variant === 'secondary',
              'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800': variant === 'ghost',
              'px-3 py-1.5 text-sm': size === 'sm',
              'px-4 py-2 text-base': size === 'md',
              'px-6 py-3 text-lg': size === 'lg',
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