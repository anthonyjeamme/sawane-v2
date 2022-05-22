import { useEffect, useRef, useState } from 'react';

export const useDragger = (
  elementRef: React.RefObject<HTMLDivElement>,
  initialPosition: TPosition,
  handleUpdatePosition: (position: TPosition, smooth: boolean) => void
) => {
  const isDraggingRef = useRef(false);
  const lastMousePositionRef = useRef<TPosition | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const currentPositionRef = useRef<TPosition | null>(initialPosition);

  const updateElementPosition = (smooth: boolean) => {
    if (!currentPositionRef.current) return;

    handleUpdatePosition(
      {
        ...currentPositionRef.current,
      },
      smooth
    );
  };

  const handleMouseDown = (e: MouseEvent) => {
    setIsDragging(true);
    isDraggingRef.current = true;
    lastMousePositionRef.current = {
      x: e.clientX,
      y: e.clientY,
    };

    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('blur', handleMouseUp);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    isDraggingRef.current = false;
    lastMousePositionRef.current = null;

    if (currentPositionRef.current)
      currentPositionRef.current = {
        x: Math.round(currentPositionRef.current.x / 40) * 40,
        y: Math.round(currentPositionRef.current.y / 40) * 40,
      };

    updateElementPosition(true);

    window.removeEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (
      !isDraggingRef.current ||
      !lastMousePositionRef.current ||
      !currentPositionRef.current ||
      !elementRef.current
    )
      return;

    const delta = {
      x: e.clientX - lastMousePositionRef.current.x,
      y: e.clientY - lastMousePositionRef.current.y,
    };

    currentPositionRef.current = {
      x: currentPositionRef.current.x + delta.x,
      y: currentPositionRef.current.y + delta.y,
    };

    updateElementPosition(false);

    lastMousePositionRef.current = {
      x: e.clientX,
      y: e.clientY,
    };
  };

  useEffect(() => {
    if (!elementRef.current) return;

    elementRef.current.addEventListener('mousedown', handleMouseDown);

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      if (!elementRef.current) return;
      elementRef.current.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return {
    isDragging,
  };
};

type TPosition = {
  x: number;
  y: number;
};
