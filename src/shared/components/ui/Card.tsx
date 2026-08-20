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
      whileHover={hover ? { y: -6, boxShadow: '0 22px 60px rgba(99, 102, 241, 0.12)' } : undefined}
      transition={{ duration: 0.2 }}
      className={twMerge(
        clsx(
          'rounded-[26px] border border-border bg-surface shadow-[var(--shadow-sm)] backdrop-blur-sm',
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