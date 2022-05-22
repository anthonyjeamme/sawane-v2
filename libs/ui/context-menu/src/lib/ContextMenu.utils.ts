import { useEffect } from 'react';
import { TContextMenuPosition } from './ContextMenu.types';

export const getMenuPosition = (
  e: React.MouseEvent<HTMLDivElement, MouseEvent>
): TContextMenuPosition => {
  return {
    x: e.clientX,
    y: e.clientY,
  };
};

export const useClickOutside: TUseClickOutside = (setIsOpen, rootRef) => {
  useEffect(() => {
    const clickOutsideEvent = (event: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const closeDropdown = () => {
      setIsOpen(false);
    };
    window.addEventListener('mousedown', clickOutsideEvent);
    window.addEventListener('blur', closeDropdown);
    return () => {
      window.removeEventListener('mousedown', clickOutsideEvent);
      window.removeEventListener('blur', closeDropdown);
    };

    return () => {
      //
    };
  }, [setIsOpen, rootRef]);

  return null;
};

type TUseClickOutside = (
  setIsOpen: (isOpen: boolean) => void,
  rootRef: React.RefObject<HTMLElement>
) => null;
