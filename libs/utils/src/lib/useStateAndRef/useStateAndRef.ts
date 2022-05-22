import { useRef, useState } from 'react';

type TUseStateAndRef = (
  initData: unknown
) => [data: unknown, update: (data: unknown) => void, get: () => unknown];

export const useStateAndRef: TUseStateAndRef = (initData) => {
  const dataRef = useRef(initData);

  const [data, setData] = useState(initData);

  const update = (data: unknown) => {
    dataRef.current = data;
    setData(data);
  };

  return [data, update, () => dataRef.current];
};
