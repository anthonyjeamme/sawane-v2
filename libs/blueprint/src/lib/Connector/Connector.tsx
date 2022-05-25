import { classNameModule } from '@sawane/utils';
import React, { useRef, useState } from 'react';

import styles from './Connector.module.scss';

const className = classNameModule(styles);

type TConnectorPosition = {
  x: number;
  y: number;
};

export const Connector = ({
  position,
  color,
  handleStartDrawingArrow,
  path,
  type,
}: {
  position: TConnectorPosition;
  color: string;
  handleStartDrawingArrow: (path: string[]) => void;
  path: string[];
  type: 'input' | 'output';
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [isDrawingArrow, setIsDrawingArrow] = useState(false);

  const handleStartArrow = () => {
    handleStartDrawingArrow(path);

    setIsDrawingArrow(true);

    const handleMouseUp = (e: MouseEvent) => {
      setIsDrawingArrow(false);

      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseleave', handleMouseUp);
    };

    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseleave', handleMouseUp);
  };

  return (
    <div
      ref={rootRef}
      data-element="connector"
      data-type={type}
      data-path={path.join(',')}
      onMouseDown={(e) => {
        if (type === 'input') return;

        e.preventDefault();
        e.stopPropagation();
        handleStartArrow();
      }}
      {...className('Connector', {
        isDrawingArrow,
        isDraggable: type === 'output',
      })}
      style={{
        top: position.y,
        left: position.x,
        color,
      }}
    ></div>
  );
};
