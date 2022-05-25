import { classNameModule } from '@sawane/utils';
import { useState } from 'react';
import { TArrow, TArrowPosition } from './BlueprintArrows.types';

import uniqid from 'uniqid';

import styles from './BlueprintArrows.module.scss';

const className = classNameModule(styles);

export const useBlueprintArrows = (blueprintPosition) => {
  const [arrows, setArrows] = useState<TArrow[]>([]);
  const [drawingArrow, setDrawingArrow] = useState<TArrow | null>(null);

  const update = (data: any) => {
    const arrows: TArrow[] = [];

    for (const item of data.items) {
      if (item.output) {
        const fromPath = [item.id, 'output'];
        const toPath = item.output.path;

        const fromElement = document.querySelector(
          `[data-path="${fromPath.join(',')}"]`
        );

        const toElement = document.querySelector(
          `[data-path="${toPath.join(',')}"]`
        );
        // console.log(fromElement, '===>', toElement);

        if (fromElement && toElement) {
          const fromPosition = blueprintPosition.getElementPosition(
            fromElement,
            true
          );
          const toPosition = blueprintPosition.getElementPosition(
            toElement,
            true
          );

          console.log({ fromPosition, toPosition });

          arrows.push({
            id: uniqid(),
            from: fromPosition,
            to: toPosition,
          });
        }
      }
    }

    setArrows(arrows);
  };

  const startDrawingArrow = (position: TArrowPosition, color?: string) => {
    setDrawingArrow({
      from: position,
      to: position,
      color,
    });
  };
  const updateDrawingArrow = (position: TArrowPosition) => {
    setDrawingArrow((drawingArrow) =>
      drawingArrow
        ? {
            ...drawingArrow,
            to: position,
          }
        : null
    );

    //
  };
  const endDrawingArrow = () => {
    //
    setDrawingArrow(null);
  };

  return {
    arrows,
    update,
    drawingArrow,
    startDrawingArrow,
    updateDrawingArrow,
    endDrawingArrow,
  };
};

interface TBlueprintArrowsProps {
  arrows: TArrow[];
  drawingArrow: TArrow | null;
}

export const BlueprintArrows = ({
  arrows,
  drawingArrow,
}: TBlueprintArrowsProps) => {
  return (
    <div {...className('Arrows')}>
      {arrows.map((arrow) => (
        <Arrow arrow={arrow} key={arrow.id} />
      ))}
      {drawingArrow && <Arrow arrow={drawingArrow} />}
    </div>
  );
};

const Arrow = ({ arrow }: { arrow: TArrow }) => {
  const padding = 10;

  const { from, to } = arrow;
  const overflowXPadding = from.x < to.x ? 0 : 200;
  const height = Math.abs(to.y - from.y) + padding * 2;
  const width = Math.abs(to.x - from.x) + overflowXPadding * 2;

  const x = Math.abs(to.x - from.x);
  const y = to.y - from.y;
  const xDelta = from.x < to.x ? x / 3 : x;
  const yDelta = from.x < to.x ? 0 : (to.y - from.y) / 2;

  const fromX = from.x < to.x ? 0 : width - overflowXPadding;
  const fromY = from.y < to.y ? padding : height - padding;

  const toX = from.x < to.x ? x : overflowXPadding;
  const toY = from.y < to.y ? y + padding : padding;

  return (
    <svg
      {...className('Arrow')}
      height={height}
      width={width}
      style={{
        transform: `translate(${Math.min(from.x, to.x) - overflowXPadding}px, ${
          Math.min(from.y, to.y) - padding
        }px)`,
      }}
    >
      <path
        fill="transparent"
        d={`M${fromX} ${fromY}, C ${fromX + xDelta} ${fromY + yDelta} ${
          toX - xDelta
        }, ${toY - yDelta} ${toX}, ${toY}`}
        stroke={arrow.color || 'white'}
        strokeLinecap="round"
        strokeWidth={3}
        strokeDasharray={6}
      />
    </svg>
  );
};
