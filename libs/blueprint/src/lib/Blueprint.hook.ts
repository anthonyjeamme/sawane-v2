import { useRef, useState } from 'react';

export const useBlueprint = (initData: TBlueprintData) => {
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

  //
  return {
    data: dataRef.current,
    refresh,
    connectNodes,
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
