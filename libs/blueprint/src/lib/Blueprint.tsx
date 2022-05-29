import { useEffect, useRef, useState } from 'react';

import uniqid from 'uniqid';
import { ContextMenuProvider } from '@sawane/ui/context-menu';

import styles from './Blueprint.module.scss';

import {
  Book,
  ChatCenteredText,
  HandPalm,
  Plus,
  Trash,
  VideoCamera,
} from 'phosphor-react';
import { useBlueprint } from './Blueprint.hook';
import { alignPositionToGrid } from './Blueprint.utils';

import { BlueprintNode } from './BlueprintNode/BlueprintNode';
import { TBlueprintNodeDefinition } from './BlueprintNode/BlueprintNode.types';
import {
  BlueprintArrows,
  useBlueprintArrows,
} from './BlueprintArrows/BlueprintArrows';
import { useDragger } from './hooks/useDragger';
import { classNameModule } from '@sawane/utils';
import { Connector } from './Connector/Connector';
import { BlueprintContextProvider } from './Blueprint.context';
import { useBlueprintPosition } from './hooks/useBlueprintPosition';
import { BlueprintSidebar } from './BlueprintSidebar/BlueprintSidebar';

const className = classNameModule(styles);
const fakeData = {
  items: [],
};

export const Blueprint = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const blueprintPosition = useBlueprintPosition(containerRef);
  const blueprintArrows = useBlueprintArrows(blueprintPosition);

  const positionRef = useRef<{ [key: string]: TPosition }>({});

  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const { data, refresh, connectNodes, getConnectionDefinition } = useBlueprint(
    fakeData,
    definitions
  );

  const [selection, setSelection] = useState<{
    from: TPosition;
    to: TPosition;
  } | null>(null);

  useEffect(() => {
    blueprintArrows.update(data);
  }, []);

  const getNearConnector = (point: TPosition) => {
    const connectors = document.querySelectorAll('[data-element=connector]');

    const distance = (from: TPosition, to: TPosition) =>
      Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2));

    for (const connector of Array.from(connectors)) {
      const position = blueprintPosition.getElementPosition(connector, true);

      const dist = distance(position, point);

      if (connector.getAttribute('data-type') === 'input' && dist < 20) {
        return {
          position,
          path: connector.getAttribute('data-path')?.split(','),
        };
      }
    }

    return null;
  };

  const handleStartDrawingArrow = (fromPath: string[]) => {
    const element = document.querySelector(
      `[data-path="${fromPath.join(',')}"]`
    );

    if (!element) return;

    const point = blueprintPosition.getElementPosition(element, true);

    blueprintArrows.startDrawingArrow(point, 'white');

    const handleMouseMove = (e: MouseEvent) => {
      const point = {
        x: e.clientX - blueprintPosition.getPosition().x,
        y: e.clientY - blueprintPosition.getPosition().y,
      };

      blueprintArrows.updateDrawingArrow(point);

      const nearConnector = getNearConnector(point);

      if (nearConnector) {
        const fromDefinition = getConnectionDefinition(fromPath);
        const toDefinition = getConnectionDefinition(nearConnector.path);

        if (connectionAreCompatibles(fromDefinition, toDefinition)) {
          blueprintArrows.updateDrawingArrow(nearConnector.position);
        } else {
          blueprintArrows.updateDrawingArrow(point);
        }
      } else {
        blueprintArrows.updateDrawingArrow(point);
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      const point = {
        x: e.clientX - blueprintPosition.getPosition().x,
        y: e.clientY - blueprintPosition.getPosition().y,
      };
      const nearConnector = getNearConnector(point);

      if (nearConnector?.path) {
        const fromDefinition = getConnectionDefinition(fromPath);
        const toDefinition = getConnectionDefinition(nearConnector.path);

        if (connectionAreCompatibles(fromDefinition, toDefinition)) {
          connectNodes(fromPath, nearConnector.path);
          blueprintArrows.update(data);
        }
      } else {
        connectNodes(fromPath, null);
        blueprintArrows.update(data);
      }

      blueprintArrows.endDrawingArrow();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const orderSelectionPosition = ({
    from,
    to,
  }: {
    from: TPosition;
    to: TPosition;
  }) => {
    const fromX = Math.min(from.x, to.x);
    const fromY = Math.min(from.y, to.y);
    const toX = Math.max(from.x, to.x);
    const toY = Math.max(from.y, to.y);

    return {
      from: {
        x: fromX,
        y: fromY,
      },
      to: {
        x: toX,
        y: toY,
      },
    };
  };

  const orderedSelection = selection ? orderSelectionPosition(selection) : null;

  const handleStartSelection = (e) => {
    const point = {
      x: e.clientX - blueprintPosition.getPosition().x,
      y: e.clientY - blueprintPosition.getPosition().y,
    };

    setSelection({
      from: point,
      to: point,
    });

    const handleMouseMove = (e: MouseEvent) => {
      const point = {
        x: e.clientX - blueprintPosition.getPosition().x,
        y: e.clientY - blueprintPosition.getPosition().y,
      };

      setSelection((selection) =>
        selection
          ? {
              from: selection.from,
              to: point,
            }
          : null
      );
    };

    const handleMouseUp = (e: MouseEvent) => {
      //

      setSelection((selection) => {
        if (!selection) return null;
        const orderedSelection = orderSelectionPosition(selection);

        const selected = Object.entries(positionRef.current)
          .filter(([key, position]) => {
            return (
              position.x > orderedSelection.from.x &&
              position.x < orderedSelection.to.x &&
              position.y > orderedSelection.from.y &&
              position.y < orderedSelection.to.y
            );
          })
          .map(([id]) => id);

        setSelectedItems(selected);

        return null;
      });
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <BlueprintContextProvider>
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
                  label: 'Etape textuelle',
                  icon: <ChatCenteredText />,
                  handleClick: (position) => {
                    if (!containerRef.current) return;

                    const id = uniqid();
                    positionRef.current[id] = alignPositionToGrid(
                      blueprintPosition.getBlueprintPosition(position)
                    );

                    data.items.push({
                      id,
                      title: 'Nouvelle étape',
                      actions: [],
                      type: 'textStep',
                    });

                    refresh();
                  },
                },
                {
                  type: 'item',
                  label: 'Etape vidéo',
                  icon: <VideoCamera />,
                  handleClick: (position) => {
                    if (!containerRef.current) return;

                    const id = uniqid();
                    positionRef.current[id] = alignPositionToGrid(
                      blueprintPosition.getBlueprintPosition(position)
                    );

                    data.items.push({
                      id,
                      title: 'Nouvelle étape',
                      actions: [],
                      type: 'videoStep',
                    });

                    refresh();
                  },
                },

                {
                  type: 'item',
                  label: 'Game Over',
                  icon: <HandPalm />,
                  handleClick: (position) => {
                    if (!containerRef.current) return;

                    const id = uniqid();
                    positionRef.current[id] = alignPositionToGrid(
                      blueprintPosition.getBlueprintPosition(position)
                    );

                    data.items.push({
                      id,
                      title: 'Nouvelle étape',
                      actions: [],
                      type: 'gameover',
                    });

                    refresh();
                  },
                },
                {
                  type: 'item',
                  label: 'Aller au chapitre',
                  icon: <Book />,
                  handleClick: (position) => {
                    if (!containerRef.current) return;

                    const id = uniqid();
                    positionRef.current[id] = alignPositionToGrid(
                      blueprintPosition.getBlueprintPosition(position)
                    );

                    data.items.push({
                      id,
                      title: 'Nouvelle étape',
                      actions: [],
                      type: 'chapter',
                    });

                    refresh();
                  },
                },
              ],
            },
          ],
        }}
      >
        <BlueprintSidebar />
        <div
          className={styles['Blueprint']}
          onContextMenu={(e) => {
            e.preventDefault();
          }}
          onMouseDown={(e) => {
            if (e.button === 0) handleStartSelection(e);
          }}
        >
          <div data-scroller ref={containerRef}>
            {orderedSelection && (
              <div
                className={styles['selection']}
                style={{
                  top: orderedSelection.from.y,
                  left: orderedSelection.from.x,
                  height: orderedSelection.to.y - orderedSelection.from.y,
                  width: orderedSelection.to.x - orderedSelection.from.x,
                }}
              />
            )}
            {data.items.map((item, index) => (
              <Node
                item={item}
                position={positionRef.current[item.id]}
                updatePosition={(position) => {
                  positionRef.current[item.id] = position;
                  blueprintArrows.update(data);
                }}
                selected={selectedItems.includes(item.id)}
                handleStartDrawingArrow={handleStartDrawingArrow}
              />
            ))}
            <BlueprintArrows {...blueprintArrows} />
          </div>
        </div>
      </ContextMenuProvider>
    </BlueprintContextProvider>
  );
};

type TPosition = {
  x: number;
  y: number;
};

const Node = ({
  position,
  updatePosition,
  item,
  selected,
  handleStartDrawingArrow,
}: {
  position: TPosition;
  updatePosition: (position: TPosition) => void;
  item: any;
  selected: boolean;
  handleStartDrawingArrow: (path: string[]) => void;
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

  useDragger(draggerRef, position, handleUpdatePosition);

  const definition = definitions[item.type];

  return (
    <ContextMenuProvider
      definition={{
        items: [
          {
            label: 'Supprimer',
            icon: <Trash />,
            handleClick: () => {},
            type: 'item',
          },
        ],
      }}
    >
      <div
        ref={rootRef}
        {...className('Node', { selected })}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
      >
        {definition.input && (
          <Connector
            color={definition.input.color || 'white'}
            type="input"
            path={[item.id, 'input']}
            handleStartDrawingArrow={handleStartDrawingArrow}
            position={{ x: 0, y: 20 }}
          />
        )}

        {definition.output && (
          <Connector
            color={definition.output.color || 'white'}
            type="output"
            path={[item.id, 'output']}
            handleStartDrawingArrow={handleStartDrawingArrow}
            position={{ x: 320, y: 20 }}
          />
        )}

        <header
          ref={draggerRef}
          style={{
            backgroundColor: definition.color,
          }}
        >
          {definition.label}
        </header>
        <BlueprintNode
          definition={definition}
          value={''}
          onChange={(data) => {
            // dataRef.current = data;
          }}
        />
      </div>
    </ContextMenuProvider>
  );
};

const definitions: Record<string, TBlueprintNodeDefinition> = {
  gameover: {
    label: 'Game over',
    color: '#b33939',
    input: {
      types: ['gameover'],
      color: '#b33939',
    },
  },
  textStep: {
    label: 'Etape textuelle',
    color: '#cd6133',
    input: {},
    output: {
      color: '#474787',
      types: ['video'],
    },
    properties: [
      {
        name: 'text',
        label: 'Texte',
        minimizable: true,
        minimizedByDefault: false,
        Renderer: ({ value, onChange }) => (
          <div>
            <textarea
              className={styles['demo-textarea']}
              defaultValue={value as string}
              onChange={(e) => {
                onChange(e.target.value);
              }}
            />
          </div>
        ),
      },
    ],
  },
  videoStep: {
    label: 'Etape vidéo',
    color: '#474787',
    input: {
      color: '#474787',
      types: ['video'],
    },
    output: {
      color: '#b33939',
      types: ['gameover'],
    },
    properties: [
      {
        name: 'text',
        label: 'Texte',
        minimizable: false,
        Renderer: ({ value, onChange }) => (
          <div>
            <textarea
              className={styles['demo-textarea']}
              defaultValue={value as string}
              onChange={(e) => {
                onChange(e.target.value);
              }}
            />
          </div>
        ),
      },
    ],
  },
  chapter: {
    label: 'Aller au chapitre',
    color: '#218c74',
  },
};

const connectionAreCompatibles = (from, to) => {
  for (const type of from.types) {
    if (to.types.includes(type)) return true;
  }

  return false;
};
