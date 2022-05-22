import { useEffect, useRef, useState } from 'react';

import uniqid from 'uniqid';
import { ContextMenuProvider } from '@sawane/ui/context-menu';

import styles from './Blueprint.module.scss';

import { classNameModule } from '@sawane/utils';
import { ChatCenteredText, Plus } from 'phosphor-react';
import { BlueprintItem } from './BlueprintItem/BlueprintItem';
import { useBlueprint } from './Blueprint.hook';
import { alignPositionToGrid } from './Blueprint.utils';

const className = classNameModule(styles);

const fakeData = {
  items: [
    {
      id: 'a',
      title: 'hello',
      color: '#0984e3',
      actions: [
        {
          id: 'b',
          text: 'blabla',
          link: 'b',
        },
      ],
    },
    {
      id: 'b',
      color: '#d63031',
      title: 'world',
      actions: [],
    },
  ],
};

export const Blueprint = () => {
  const [currentLinkDrawing, setCurrentLinkDrawing] = useState(null);

  const isDraggingRef = useRef(false);
  const lastMousePositionRef = useRef<{ x: number; y: number } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  // const contextMenu = useContextMenu(containerRef);

  const [arrows, setArrows] = useState<TArrow[]>([]);

  const positionRef = useRef<{ [key: string]: TPosition }>({
    a: { x: 80, y: 120 },
    b: { x: 40 * 16, y: 120 * 2 },
    c: { x: 40 * 22, y: 120 },
    d: { x: 40 * 13, y: 40 * 8 },
    e: { x: 40 * 13, y: 40 * 8 },
  });

  const { data, refresh } = useBlueprint(fakeData);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (!(e.target as HTMLDivElement).getAttribute('data-scroller')) return;

      if (e.button !== 1) return;

      isDraggingRef.current = true;
      lastMousePositionRef.current = {
        x: e.clientX,
        y: e.clientY,
      };
    };
    const handleMouseUp = () => {
      isDraggingRef.current = false;
      lastMousePositionRef.current = null;
    };

    const handleMouseMove = (e) => {
      if (!isDraggingRef.current || !lastMousePositionRef.current) return;

      const delta = {
        x: lastMousePositionRef.current.x - e.clientX,
        y: lastMousePositionRef.current.y - e.clientY,
      };

      containerRef.current?.scrollTo({
        left: containerRef.current.scrollLeft + delta.x,
        top: containerRef.current.scrollTop + delta.y,
      });

      lastMousePositionRef.current = {
        x: e.clientX,
        y: e.clientY,
      };
    };

    containerRef.current?.addEventListener('mousedown', handleMouseDown);
    containerRef.current?.addEventListener('mouseup', handleMouseUp);
    containerRef.current?.addEventListener('mousemove', handleMouseMove);
    containerRef.current?.addEventListener('mouseleave', handleMouseUp);

    return () => {
      containerRef.current?.removeEventListener('mousedown', handleMouseDown);
      containerRef.current?.removeEventListener('mouseup', handleMouseUp);
      containerRef.current?.removeEventListener('mousemove', handleMouseMove);
      containerRef.current?.removeEventListener('mouseleave', handleMouseUp);
    };
  }, []);

  useEffect(() => {
    updateLinks();
  }, []);

  const updateLinks = () => {
    const arrows: TArrow[] = [];

    for (const item of data.items) {
      for (let i = 0; i < item.actions.length; i++) {
        const action = item.actions[i];

        if (action.link && data.items.find(({ id }) => action.link === id)) {
          const aWidth = 320;

          const aPosition = {
            x: positionRef.current[item.id].x + aWidth,
            y: positionRef.current[item.id].y + 40 + i * 40 + 20,
          };
          const bPosition = {
            x: positionRef.current[action.link].x,
            y: positionRef.current[action.link].y + 20,
          };

          arrows.push({
            from: aPosition,
            to: bPosition,
          });
        }
      }
    }

    setArrows(arrows);
  };

  return (
    <ContextMenuProvider
      definition={{
        items: [
          {
            type: 'menu',
            label: 'Étape',
            icon: <Plus />,
            menu: [
              {
                type: 'item',
                label: 'Textuel',
                icon: <ChatCenteredText />,
                handleClick: (position) => {
                  if (!containerRef.current) return;

                  const id = uniqid();
                  positionRef.current[id] = alignPositionToGrid({
                    x: position.x + containerRef.current.scrollLeft,
                    y: position.y + containerRef.current.scrollTop,
                  });

                  data.items.push({
                    id,
                    color: '#d63031',
                    title: 'Nouvelle étape',
                    actions: [],
                  });

                  refresh();
                },
              },
            ],
          },
        ],
      }}
    >
      <div
        className={styles['Blueprint']}
        ref={containerRef}
        onContextMenu={(e) => {
          e.preventDefault();
        }}
      >
        <div data-scroller>
          {data.items.map((item) => (
            <BlueprintItem
              item={item}
              position={positionRef.current[item.id]}
              key={item.id}
              updatePosition={(position) => {
                positionRef.current[item.id] = position;
                updateLinks();
              }}
              handleUpdate={(itemUpdate) => {
                data.items = data.items.map((_item) =>
                  _item.id === item.id ? { ..._item, ...itemUpdate } : _item
                );

                refresh();
                updateLinks();
              }}
              handleRemove={() => {
                data.items = data.items.filter(({ id }) => id !== item.id);
                refresh();
                updateLinks();
              }}
              handleClickActionlink={(actionId) => {
                setCurrentLinkDrawing({
                  itemId: item.id,
                  actionId,
                });
              }}
              handleCLickLink={() => {
                if (!currentLinkDrawing) return;

                const { itemId, actionId } = currentLinkDrawing;
                const targetId = item.id;

                const findItem = data.items.find(
                  (_item) => _item.id === itemId
                );

                findItem.actions = findItem.actions.map((action) =>
                  action.id === actionId
                    ? {
                        ...action,
                        link: targetId,
                      }
                    : action
                );

                refresh();
                setCurrentLinkDrawing(null);
                updateLinks();
              }}
            />
          ))}
          <div {...className('Arrows')}>
            {arrows.map((arrow) => (
              <Arrow arrow={arrow} />
            ))}
          </div>
        </div>
      </div>
    </ContextMenuProvider>
  );
};

type TArrow = {
  from: TPosition;
  to: TPosition;
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
        stroke="white"
        strokeLinecap="round"
        strokeWidth={3}
        strokeDasharray={6}
      />
    </svg>
  );
};

type TPosition = {
  x: number;
  y: number;
};
