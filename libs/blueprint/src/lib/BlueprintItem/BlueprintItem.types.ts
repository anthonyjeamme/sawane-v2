export type TBlueprintItemProps = {
  item: any; // TODO
  position: TPosition;
  updatePosition: (position: TPosition) => void;
  handleUpdate: (item: any) => void;
  handleRemove: () => void;
  handleClickActionlink: (actionId: string) => void;
  handleCLickLink: () => void;
};

export type TPosition = {
  x: number;
  y: number;
};
