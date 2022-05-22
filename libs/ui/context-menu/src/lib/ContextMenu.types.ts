import { ReactNode } from 'react';

export type TContextMenuProviderProps = {
  children: ReactNode;
  definition: TContextMenuDefinition;
};

export type TContextMenuProps = {
  position: TContextMenuPosition;
  handleClose: () => void;
  definition: TContextMenuDefinition;
};

export type TContextMenuState = TContextMenuStateOpen | TContextMenuStateClosed;

type TContextMenuStateOpen = {
  isOpen: boolean;
  position: TContextMenuPosition;
};
type TContextMenuStateClosed = {
  isOpen: false;
};

export type TContextMenuPosition = {
  x: number;
  y: number;
};

export type TContextMenuContentProps = {
  definition: TContextMenuDefinition;
  handleClose: () => void;
  position: TContextMenuPosition;
};

/* CONTEXT MENU DEFINITION */
export type TContextMenuDefinition = {
  items: TContextMenuDefinitionItem[];
};

export type TContextMenuDefinitionItem = TActionItem | TMenuItem | TSeparator;

export type TActionItem = {
  type: 'item';
  icon: JSX.Element;
  label: string;
  payload?: unknown;
  handleClick: (position: TContextMenuPosition, payload?: unknown) => void;
  //
};

export type TMenuItem = {
  type: 'menu';
  icon: JSX.Element;
  label: string;
  menu: TContextMenuDefinitionItem[];
};

type TSeparator = {
  type: 'separator';
};
