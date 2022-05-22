import React, { useRef } from 'react';
import { classNameModule } from '@sawane/utils';
import {
  Plus,
  Lightning,
  PencilSimple,
  DotsSixVertical,
  Trash,
} from 'phosphor-react';

import uniqid from 'uniqid';

import styles from './BlueprintItem.module.scss';
import { TBlueprintItemProps, TPosition } from './BlueprintItem.types';
import { useDragger } from '../hooks/useDragger';
import { ContextMenuProvider } from '@sawane/ui/context-menu';

const className = classNameModule(styles);

export const BlueprintItem: React.FC<TBlueprintItemProps> = ({
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
    <ContextMenuProvider
      definition={{
        items: [
          {
            type: 'item',
            icon: <Trash />,
            label: 'Supprimer',
            handleClick: () => {
              handleRemove();
            },
          },
        ],
      }}
    >
      <div
        {...className('BlueprintItemContainer')}
        ref={rootRef}
        style={{
          transform: `translate(${position?.x}px, ${position?.y}px)`,
        }}
      >
        <div {...className('BlueprintItem', { isDragging })}>
          <header
            onClick={() => {
              handleCLickLink();
            }}
            style={{
              backgroundColor: item.color,
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
              <Trash />
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
                      actions: item.actions.filter(
                        ({ id }) => id !== action.id
                      ),
                    });
                  }}
                >
                  <Trash />
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
    </ContextMenuProvider>
  );
};
