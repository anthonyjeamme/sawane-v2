export type TContextMenuProps = {
  handleAction: (name: string) => void;
} & TContextMenuHook;
export type TContextMenuHook = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  position: {
    x: number;
    y: number;
  };
};

export type TContextMenuDefinition = TContextMenuDefinitionItem[];

export type TContextMenuDefinitionItem =
  | TContextMenuDefinitionSimpleItem
  | TContextMenuDefinitionCategoryItem;

export type TContextMenuDefinitionSimpleItem = {
  type: 'simple';
  title: string;
  handleClick: () => void;
  icon?: JSX.Element;
};

export type TContextMenuDefinitionCategoryItem = {
  type: 'category';
  title: string;
  icon?: JSX.Element;
  children?: TContextMenuDefinitionSimpleItem[];
};
