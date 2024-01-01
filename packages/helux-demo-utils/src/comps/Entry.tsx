import React from 'react';

export function useForceUpdate() {
  const [, setState] = React.useState({});
  return () => setState({});
}

interface IProps {
  buttonArea?: React.ReactNode;
  fns?: Array<any> | Record<string, any>;
}

function eusuerFns(props: IProps) {
  const { fns = [] } = props;
  let newFns = [];
  if (!Array.isArray(fns)) {
    Object.keys(fns).forEach((key) => {
      const fn = fns[key];
      fn.__fnName = key;
      newFns.push(fn);
    });
  } else {
    newFns = fns;
  }
  return newFns;
}

export function Entry(props: React.PropsWithChildren<IProps>) {
  const { buttonArea = '', children } = props;
  const [show, setShow] = React.useState(true);
  const forceUpdate = useForceUpdate();

  return (
    <div>
      <button onClick={() => setShow(!show)}>switch show</button>
      <button onClick={forceUpdate}>force update</button>
      {eusuerFns(props).map((fn, idx) => (
        <button key={idx} onClick={fn}>
          {fn.__fnName || fn.name}
        </button>
      ))}
      {buttonArea}
      <div className="box">{show && children}</div>
    </div>
  );
}
