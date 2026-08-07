import { motion, type HTMLMotionProps } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

type CardProps = HTMLMotionProps<'div'> & {
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
};

export default function Card({ className, hover = true, padding = 'md', children, ...props }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, boxShadow: 'var(--shadow-card-hover)' } : undefined}
      transition={{ duration: 0.2 }}
      className={twMerge(
        clsx(
          'rounded-card border border-gray-200/60 bg-surface shadow-card dark:border-gray-700/40 dark:bg-surface',
          {
            'p-0': padding === 'none',
            'p-4': padding === 'sm',
            'p-6': padding === 'md',
            'p-8': padding === 'lg',
          },
          className,
        )
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}