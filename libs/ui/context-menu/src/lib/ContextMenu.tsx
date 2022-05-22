import React, { useRef } from 'react';

import {
  TContextMenuProps,
  TContextMenuProviderProps,
  TContextMenuState,
} from './ContextMenu.types';

import { useState } from 'react';
import { getMenuPosition, useClickOutside } from './ContextMenu.utils';

import styles from './ContextMenu.module.scss';
import { ContextMenuContent } from './ContextMenuContent';

export const ContextMenuProvider: React.FC<TContextMenuProviderProps> = ({
  children,
  definition,
}) => {
  const [menuState, setMenuState] = useState<TContextMenuState>({
    isOpen: false,
  });

  const handleContextMenu = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const position = getMenuPosition(e);

    setMenuState({
      isOpen: true,
      position,
    });
  };

  const handleClose = () => {
    setMenuState({
      isOpen: false,
    });
  };

  return (
    <div onContextMenu={handleContextMenu}>
      {menuState.isOpen && (
        <ContextMenu
          position={menuState.position}
          handleClose={handleClose}
          definition={definition}
        />
      )}

      {children}
    </div>
  );
};

export const ContextMenu: React.FC<TContextMenuProps> = ({
  position,
  handleClose,
  definition,
}) => {
  const rootRef = useRef<HTMLDivElement>(null);

  useClickOutside(handleClose, rootRef);

  return (
    <div
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      ref={rootRef}
      className={styles['ContextMenu']}
      style={{
        top: position.y,
        left: position.x,
      }}
    >
      <ContextMenuContent
        definition={definition}
        handleClose={handleClose}
        position={position}
      />
    </div>
  );
};
