import React, { useRef } from 'react';

interface TBlueprintData {
  updateNode: (id: string, updateData: unknown) => void;
  getPositionOffset: () => { x: number; y: number };
}

const blueprintCtx = React.createContext<TBlueprintData>({
  updateNode: () => {
    //
  },
  getPositionOffset: () => ({
    x: 0,
    y: 0,
  }),
});

interface TBlueprintContextProviderProps {
  children: JSX.Element;
}

export const useBlueprint = () => React.useContext(blueprintCtx);

export const BlueprintContextProvider: React.FC<
  TBlueprintContextProviderProps
> = ({ children }) => {
  const dataRef = useRef({
    nodes: [],
  });

  const updateNode = (id: string, updateData: unknown) => {
    const index = dataRef.current.nodes.findIndex((node) => node.id === id);

    dataRef.current.nodes[index] = {
      ...dataRef.current.nodes[index],
      ...updateData,
    };
  };

  const getPositionOffset = () => {
    return {
      x: 0,
      y: 0,
    };
  };

  return (
    <blueprintCtx.Provider
      value={{
        updateNode,
        getPositionOffset,
      }}
    >
      {children}
    </blueprintCtx.Provider>
  );
};
