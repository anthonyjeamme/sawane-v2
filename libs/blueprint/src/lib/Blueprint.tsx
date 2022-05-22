import React, { useEffect, useRef, useState } from 'react';

import uniqid from 'uniqid';

import styles from './Blueprint.module.scss';

import { classNameModule, useStateAndRef } from '@sawane/utils';
import {
  DotsSixVertical,
  Lightning,
  PencilSimple,
  Plus,
  TrashSimple,
} from 'phosphor-react';
import { useContextMenu } from './ContextMenu/ContextMenu.hook';
import { ContextMenu } from './ContextMenu/ContextMenu';

const className = classNameModule(styles);

export const Blueprint = () => {
  const [data, updateData, getDataRef] = useStateAndRef({
    items: [
      {
        id: 'a',
        title: 'hello',
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
        title: 'world',
        actions: [],
      },
    ],
  });

  const [currentLinkDrawing, setCurrentLinkDrawing] = useState(null);

  const isDraggingRef = useRef(false);
  const lastMousePositionRef = useRef<{ x: number; y: number } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const contextMenu = useContextMenu(containerRef);

  const [arrows, setArrows] = useState<TArrow[]>([]);

  const positionRef = useRef({
    a: { x: 80, y: 120 },
    b: { x: 40 * 16, y: 120 * 2 },
    c: { x: 40 * 22, y: 120 },
    d: { x: 40 * 13, y: 40 * 8 },
    e: { x: 40 * 13, y: 40 * 8 },
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

    for (const item of getDataRef().items) {
      for (let i = 0; i < item.actions.length; i++) {
        const action = item.actions[i];

        if (
          action.link &&
          getDataRef().items.find(({ id }) => action.link === id)
        ) {
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
    <>
      <ContextMenu
        {...contextMenu}
        handleAction={(action) => {
          if (action === 'new-step') {
            const id = uniqid();

            positionRef.current[id] = {
              x:
                Math.round(
                  (contextMenu.position.x + containerRef.current?.scrollLeft) /
                    40
                ) * 40,
              y:
                Math.round(
                  (contextMenu.position.y + containerRef.current?.scrollTop) /
                    40
                ) * 40,
            };
            updateData({
              ...getDataRef(),
              items: [
                ...getDataRef().items,
                {
                  id,
                  title: 'Nouvelle étape',
                  actions: [
                    {
                      id: 'a' + uniqid(),
                      text: 'Action A',
                      link: null,
                    },
                    {
                      id: 'b' + uniqid(),
                      text: 'Action B',
                      link: null,
                    },
                  ],
                },
              ],
            });

            updateLinks();
          }
        }}
      />
      <div
        className={styles['Blueprint']}
        ref={containerRef}
        onContextMenu={(e) => {
          e.preventDefault();
        }}
      >
        <div data-scroller>
          {data.items.map((item) => (
            <Item
              item={item}
              position={positionRef.current[item.id]}
              key={item.id}
              updatePosition={(position) => {
                positionRef.current[item.id] = position;
                updateLinks();
              }}
              handleUpdate={(item) => {
                updateData({
                  ...getDataRef(),
                  items: getDataRef().items.map((_item) =>
                    _item.id === item.id ? item : _item
                  ),
                });
                updateLinks();
              }}
              handleRemove={() => {
                updateData({
                  ...getDataRef(),
                  items: getDataRef().items.filter(({ id }) => id !== item.id),
                });
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

                updateData({
                  ...getDataRef(),
                  items: getDataRef().items.map((item) =>
                    item.id === itemId
                      ? {
                          ...item,
                          actions: item.actions.map((action) =>
                            action.id === actionId
                              ? {
                                  ...action,
                                  link: targetId,
                                }
                              : action
                          ),
                        }
                      : item
                  ),
                });

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
    </>
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

const Item = ({
  item,
  position,
  updatePosition,
  handleClickActionlink,
  handleCLickLink,
  handleRemove,
  handleUpdate,
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const draggerRef = useRef<HTMLDivElement>(null);

  const handleUpdatePosition = ({ x, y }: TPosition, smooth: boolean) => {
    if (!rootRef.current) return;

    if (smooth) {
      rootRef.current.style.transition = 'transform 200ms';

      setTimeout(() => {
        if (!rootRef.current) return;
        rootRef.current.style.transition = 'none';
      }, 250);
    }

    updatePosition({ x, y });

    rootRef.current.style.transform = `translate(${x}px, ${y}px)`;
  };

  const { isDragging } = useDragger(draggerRef, position, handleUpdatePosition);

  return (
    <div
      {...className('ItemContainer')}
      ref={rootRef}
      style={{
        transform: `translate(${position?.x}px, ${position?.y}px)`,
      }}
    >
      <div {...className('Item', { isDragging })}>
        <header
          onClick={() => {
            handleCLickLink();
          }}
        >
          <span className={styles['title']}>
            <input defaultValue={item.title} />
          </span>
          <button
            className={styles['remove']}
            onClick={() => {
              handleRemove();
            }}
          >
            <TrashSimple />
          </button>
          <button className={styles['edit']} title="Editer">
            <PencilSimple weight="bold" />
          </button>
          <button ref={draggerRef} className={styles['dragger']}>
            <DotsSixVertical weight="bold" />
          </button>
        </header>
        <div className={styles['content']}>
          {item.actions.map((action) => (
            <div
              {...className('action')}
              key={action.id}
              onClick={() => {
                handleClickActionlink(action.id);
              }}
            >
              <button
                onClick={() => {
                  handleUpdate({
                    ...item,
                    actions: item.actions.filter(({ id }) => id !== action.id),
                  });
                }}
              >
                <TrashSimple />
              </button>
              <button>
                <Lightning />
              </button>
              <span>
                <input
                  defaultValue={action.text}
                  onChange={(e) => {
                    handleUpdate({
                      ...item,
                      actions: item.actions.map((_action) =>
                        _action.id === action.id
                          ? {
                              ...action,
                              text: e.target.value,
                            }
                          : _action
                      ),
                    });
                  }}
                />
              </span>
            </div>
          ))}

          <div
            {...className('add-action')}
            onClick={() => {
              handleUpdate({
                ...item,
                actions: [
                  ...item.actions,
                  {
                    id: uniqid(),
                    text: 'Nouvelle action',
                    link: null,
                  },
                ],
              });
            }}
          >
            <Plus />
          </div>
        </div>
      </div>
    </div>
  );
};

type TPosition = {
  x: number;
  y: number;
};

const useDragger = (
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

  const handleMouseMove = (e) => {
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
