import React, { useContext, useState, createContext } from 'react';
import { CaretRight } from 'phosphor-react';

import {
  TMenuItem,
  TActionItem,
  TContextMenuContentProps,
  TContextMenuDefinitionItem,
  TContextMenuPosition,
} from './ContextMenu.types';

import styles from './ContextMenuContent.module.scss';

const ctx = createContext<{
  handleClose: () => void;
  position: TContextMenuPosition;
}>({
  handleClose: () => {
    //
  },
  position: {
    x: 0,
    y: 0,
  },
});

export const ContextMenuContent: React.FC<TContextMenuContentProps> = ({
  definition,
  handleClose,
  position,
}) => {
  return (
    <ctx.Provider value={{ handleClose, position }}>
      <div className={styles['ContextMenuContent']}>
        {definition.items.map((item, index) => (
          <Item item={item} key={index} />
        ))}
      </div>
    </ctx.Provider>
  );
};

const Item: React.FC<{ item: TContextMenuDefinitionItem }> = ({ item }) => {
  switch (item.type) {
    case 'item':
      return <ActionItem item={item} />;
    case 'menu':
      return <MenuItem item={item} />;
    case 'separator':
      return <hr className={styles['separator']} />;
    default:
      return null;
  }
};

const ActionItem: React.FC<{ item: TActionItem }> = ({ item }) => {
  const { handleClose, position } = useContext(ctx);

  return (
    <button
      className={styles['ActionItem']}
      onClick={() => {
        item.handleClick(position, item.payload);
        handleClose();
      }}
    >
      <span className={styles['icon']}>{item.icon}</span>
      <span className={styles['label']}>{item.label}</span>
    </button>
  );
};

const MenuItem: React.FC<{ item: TMenuItem }> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles['MenuItem']}>
      <button
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <span className={styles['icon']}>{item.icon}</span>
        <span className={styles['label']}>{item.label}</span>
        <span className={styles['caret']}>
          <CaretRight />
        </span>
      </button>

      {isOpen && (
        <div className={styles['submenu']}>
          {item.menu.map((item, index) => (
            <Item item={item} key={index} />
          ))}
        </div>
      )}
    </div>
  );
};
