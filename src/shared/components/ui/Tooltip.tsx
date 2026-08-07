import { useState } from 'react';
import {
  useFloating, autoUpdate, offset, flip, shift, useHover, useFocus,
  useDismiss, useRole, useInteractions, FloatingPortal,
} from '@floating-ui/react';

interface TooltipProps {
  content: string;
  children: React.ReactElement;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

export default function Tooltip({ content, children, placement = 'top' }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const { refs, floatingStyles, context } = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    middleware: [offset(6), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  const hover = useHover(context, { move: false });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'tooltip' });
  const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus, dismiss, role]);

  return (
    <>
      <div ref={refs.setReference} {...getReferenceProps()}>
        {children}
      </div>
      {open && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className="z-[var(--z-tooltip)] rounded-lg bg-gray-900 px-3 py-1.5 text-xs text-white shadow-lg dark:bg-gray-700"
          >
            {content}
          </div>
        </FloatingPortal>
      )}
    </>
  );
}