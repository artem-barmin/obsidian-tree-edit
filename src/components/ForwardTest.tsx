import { h, FunctionComponent, createRef, JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';

export const ForwardTest: FunctionComponent<any> = () => {
  const ref = createRef();

  return (
    <div ref={ref} className="blabla">
      <Test testRef={ref} />
      <div>Здесь хочу передать рефку пропсу</div>
    </div>
  );
};

const Test: FunctionComponent<any> = ({ testRef }) => {
  const firstRenderRef = useRef(true);
  useEffect(() => {
    if (firstRenderRef.current) firstRenderRef.current = false;
    else {
      console.log(testRef);
    }
  }, [testRef]);
  return <div id="children">Здесь хочу получить рефку из пропса</div>;
};
