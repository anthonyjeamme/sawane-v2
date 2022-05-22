import { useClickOutside } from '@sawane/utils';
import { useEffect, useState } from 'react';
import { TContextMenuHook } from './ContextMenu.types';

export const useContextMenu = (
  containerRef: React.RefObject<HTMLDivElement>
): TContextMenuHook => {
  const [position, setPosition] = useState({
    x: 200,
    y: 200,
  });
  const [isOpen, setIsOpen] = useState(false);

  const handleContextMenu = (e) => {
    //

    setPosition({
      x: e.clientX,
      y: e.clientY,
    });

    setIsOpen(true);
  };

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.addEventListener('contextmenu', handleContextMenu);

    return () => {
      if (!containerRef.current) return;

      containerRef.current.addEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  const open = () => {
    // TODO
  };

  const close = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    open,
    close,
    position,
  };
};
