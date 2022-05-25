import { useEffect, useRef } from 'react';

export const useBlueprintPosition = (
  containerRef: React.RefObject<HTMLDivElement>
) => {
  const isDraggingRef = useRef(false);
  const lastMousePositionRef = useRef<{ x: number; y: number } | null>(null);
  const containerPosition = useRef({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (!(e.target as HTMLDivElement).getAttribute('data-scroller')) return;

      if (e.button !== 1) return;

      isDraggingRef.current = true;
      lastMousePositionRef.current = {
        x: e.clientX,
        y: e.clientY,
      };

      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseleave', handleMouseUp);
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      lastMousePositionRef.current = null;

      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseUp);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (
        !isDraggingRef.current ||
        !lastMousePositionRef.current ||
        !containerRef.current
      )
        return;

      const delta = {
        x: lastMousePositionRef.current.x - e.clientX,
        y: lastMousePositionRef.current.y - e.clientY,
      };

      const x = containerPosition.current.x - delta.x;
      const y = containerPosition.current.y - delta.y;

      containerRef.current.style.transform = `translate(${x}px, ${y}px)`;

      containerPosition.current = {
        x,
        y,
      };

      lastMousePositionRef.current = {
        x: e.clientX,
        y: e.clientY,
      };
    };

    const containerElement = containerRef.current;

    if (!containerElement) return;
    containerElement.addEventListener('mousedown', handleMouseDown);

    return () => {
      containerElement.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  const getPosition = () => containerPosition.current;

  const getElementPosition = (element: Element, center: boolean) => {
    const { x, y, width, height } = element.getBoundingClientRect();

    if (center) {
      return {
        x: x - getPosition().x + width / 2,
        y: y - getPosition().y + height / 2,
      };
    }

    return {
      x: x - getPosition().x,
      y: y - getPosition().y,
    };
  };

  const getBlueprintPosition = (position: { x: number; y: number }) => {
    return {
      x: position.x - getPosition().x,
      y: position.y - getPosition().y,
    };
  };

  return {
    getPosition,
    getBlueprintPosition,
    getElementPosition,
  };
};
