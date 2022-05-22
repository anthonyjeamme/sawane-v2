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
