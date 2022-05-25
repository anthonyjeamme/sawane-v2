import { TPosition } from './BlueprintItem/BlueprintItem.types';

export const alignPositionToGrid = (position: TPosition) => ({
  x: Math.round(position.x / 20) * 20,
  y: Math.round(position.y / 20) * 20,
});
