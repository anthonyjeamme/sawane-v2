import { useClickOutside } from '@sawane/utils';
import { Article, CaretRight, Plus } from 'phosphor-react';
import React, { useRef, useState } from 'react';

import styles from './ContextMenu.module.scss';
import {
  TContextMenuDefinition,
  TContextMenuDefinitionCategoryItem,
  TContextMenuDefinitionItem,
  TContextMenuDefinitionSimpleItem,
  TContextMenuProps,
} from './ContextMenu.types';

type TContextMenuProviderProps = any;

type TContextMenuPosition = {
  x: number;
  y: number;
};

type TContextMenuState = {
  isOpen: boolean;
  position: TContextMenuPosition | null;
};

export const ContextMenuProvider: React.FC<TContextMenuProviderProps> = ({
  children,
}) => {
  const [state, setState] = useState<TContextMenuState>({
    position: null,
    isOpen: false,
  });

  const handleContextMenu = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (e.button !== 2) return;
    e.preventDefault();

    const position = {
      x: e.clientX,
      y: e.clientY,
    };

    setState({
      isOpen: true,
      position,
    });
  };

  console.log(state);

  return (
    <div onContextMenu={handleContextMenu}>
      {state.isOpen && (
        <div
          style={{
            position: 'fixed',
            zIndex: 1000,
            background: 'red',
            top: state.position?.y,
            left: state.position?.x,
          }}
        >
          Context bitch
        </div>
      )}

      {children}
    </div>
  );
};

export const ContextMenu: React.FC<TContextMenuProps> = ({
  close,
  isOpen,
  position,
  handleAction,
}) => {
  const rootRef = useRef<HTMLDivElement>(null);

  useClickOutside(isOpen, close, rootRef);

  const menu: TContextMenuDefinition = [
    {
      title: 'Etape',
      children: [
        {
          title: 'Texte simple',
          type: 'simple',
          icon: <Article />,
          handleClick: () => {
            //
          },
        },
      ],
      icon: <Plus weight="bold" />,
      type: 'category',
    },
  ];

  if (!isOpen) return null;

  return (
    <div
      className={styles['ContextMenu']}
      ref={rootRef}
      style={{
        top: position?.y || 0,
        left: position?.x || 0,
      }}
    >
      {menu.map((menuItem) => (
        <MenuItem item={menuItem} />
      ))}

      <button
        onClick={() => {
          handleAction('new-step');
          close();
        }}
      >
        <Plus weight="bold" /> Nouvelle étape
      </button>
    </div>
  );
};

const MenuItem = ({ item }: { item: TContextMenuDefinitionItem }) => {
  if (item.type === 'category') return <CategoryMenuItem item={item} />;

  return <SimpleMenuItem item={item} />;
};

const CategoryMenuItem = ({
  item,
}: {
  item: TContextMenuDefinitionCategoryItem;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles['CategoryMenuItem']}>
      <button
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <span>
          {item.icon}
          {item.title}
        </span>
        <i>
          <CaretRight size={10} />
        </i>
      </button>

      {isOpen && (
        <div className={styles['dropdown']}>
          {item.children.map((item) => (
            <SimpleMenuItem item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

const SimpleMenuItem = ({
  item,
}: {
  item: TContextMenuDefinitionSimpleItem;
}) => {
  return <button>{item.title}</button>;
};
