import React from 'react'

export function useForceUpdate() {
  const [, setState] = React.useState({});
  return () => setState({});
}

// import React from "react";
// import { useForceUpdate } from "helux";

export function Entry(props: React.PropsWithChildren<{ buttonArea?: React.ReactNode, fns?: Array<any> }>) {
  const { buttonArea = '', fns = [], children } = props;
  console.log("Render Entry");
  const [show, setShow] = React.useState(true);
  const forceUpdate = useForceUpdate();

  return (
    <div>
      <button onClick={() => setShow(!show)}>switch show</button>
      <button onClick={forceUpdate}>force update</button>
      {fns.map((fn, idx) => <button key={idx} onClick={fn}>{fn.__fnName || fn.name}</button>)}
      {buttonArea}
      <div className="box">
        {show && children}
      </div>
    </div>
  );
}