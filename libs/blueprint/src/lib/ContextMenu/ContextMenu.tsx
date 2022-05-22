import { useClickOutside } from '@sawane/utils';
import { Plus } from 'phosphor-react';
import React, { useRef } from 'react';

import styles from './ContextMenu.module.scss';
import { TContextMenuProps } from './ContextMenu.types';

export const ContextMenu: React.FC<TContextMenuProps> = ({
  close,
  isOpen,
  position,
  handleAction,
}) => {
  const rootRef = useRef<HTMLDivElement>(null);

  useClickOutside(isOpen, close, rootRef);

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
      <button
        onClick={() => {
          handleAction('new-step');
          close();
        }}
      >
        <Plus /> Nouvelle étape
      </button>
    </div>
  );
};
