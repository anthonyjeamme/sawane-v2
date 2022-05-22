import { useRef, useState } from 'react';

export const useBlueprint = (initData: any) => {
  const dataRef = useRef(initData);
  const refresh = useRefresh();

  //
  return {
    data: dataRef.current,
    refresh,
  };
};

export const useRefresh = () => {
  const [count, setCount] = useState(0);

  const refresh = () => {
    setCount(count + 1);
  };

  return refresh;
};
