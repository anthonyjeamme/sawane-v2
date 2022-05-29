import { useRef, useState } from 'react';
import { TBlueprintNodeDefinition } from './BlueprintNode/BlueprintNode.types';

export const useBlueprint = (
  initData: TBlueprintData,
  definitions: Record<string, TBlueprintNodeDefinition>
) => {
  const dataRef = useRef<TBlueprintData>(initData);
  const refresh = useRefresh();

  const connectNodes = (fromPath: string[], toPath: string[] | null) => {
    const [fromNodeId] = fromPath;

    const fromNode = dataRef.current.items.find(({ id }) => id === fromNodeId);

    if (!fromNode) return;

    if (fromPath[1] === 'output') {
      fromNode.output = toPath
        ? {
            path: toPath,
          }
        : undefined;
    } else {
      // TODO property
    }
    console.log(dataRef.current.items);

    refresh();
  };

  const getConnectionDefinition = (path: string[]) => {
    //

    const [nodeId] = path;

    const node = dataRef.current.items.find((node) => node.id === nodeId);

    if (!node) return null;

    if (path[1] === 'input') {
      return definitions[node.type].input;
    } else if (path[1] === 'output') {
      return definitions[node.type].output;
    }
    return null;
  };

  //
  return {
    data: dataRef.current,
    refresh,
    connectNodes,
    getConnectionDefinition,
  };
};

type TBlueprintData = {
  items: TBlueprintItem[];
};

type TBlueprintItem = {
  id: string;
  properties: TBlueprintItemProperty[];
  output?: TBlueprintItemOutput;
};

type TBlueprintItemProperty = {
  // TODO
};
type TBlueprintItemOutput = {
  path: string[];
};

export const useRefresh = () => {
  const [count, setCount] = useState(0);

  const refresh = () => {
    setCount(count + 1);
  };

  return refresh;
};
