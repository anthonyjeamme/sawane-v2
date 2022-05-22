import { TPosition } from './BlueprintItem/BlueprintItem.types';

export const alignPositionToGrid = (position: TPosition) => ({
  x: Math.round(position.x / 40) * 40,
  y: Math.round(position.y / 40) * 40,
});
