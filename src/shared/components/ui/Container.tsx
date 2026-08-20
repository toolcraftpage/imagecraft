import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function Container({ children, className }: ContainerProps) {
  return (
    <div className={twMerge(clsx('mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8', className))}>
      {children}
    </div>
  );
}