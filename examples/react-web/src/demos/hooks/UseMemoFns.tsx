import { useObject, Fn } from 'helux';
import React from 'react';
import { MarkUpdate } from '../comps';
import { random } from "../logic/util";

export function useMemoFns<T extends Record<string, Fn>>(fns: T): T {
  const srvRef = React.useRef(fns);
  // srvRef.current = fns;
  srvRef.current = React.useMemo(() => fns, [fns]);
  const [srvWrap] = React.useState(() => {
    const srvWrap = {} as T;
    Object.keys(fns).forEach((key) => {
      // @ts-ignore
      srvWrap[key] = (...args: any[]) => srvRef.current[key](...args);
    });
    return srvWrap
  });
  return srvWrap;
}

const Child = React.memo((props: any) => {
  console.log('Render Child');
  return <MarkUpdate forceColor={true}>
    {props.name} Child
  </MarkUpdate>
});

// SDN
// 1 Stable Ref
// 2 Data reliable
// 3 No deps

function Comp(props: any) {
  // const [obj, setObj] = useObject({ num: 1 });
  const [obj, setObj] = React.useState({ num: 1 });

  const srv = useMemoFns({
    readState() {
      console.log(`%c read state num ${obj.num}`, `color:green`);
    },
    readProps() {
      console.log(`%c read props num ${props.num}`, `color:green`);
    },
    changeNum() {
      setObj({ num: obj.num + 1 });
    },
  });

  const srv2 = React.useMemo(() => ({
    readState() {
      console.log(`%c read state num ${obj.num}`, `color:red`);
    },
    readProps() {
      console.log(`%c read props num ${props.num}`, `color:red`);
    },
  // }), [obj.num, props.num]);
  }), []);


  return (
    <MarkUpdate>
      <button onClick={() => setObj({ num: random() })}>change local num</button><br />
      <button style={{ color: 'green' }} onClick={() => srv.readState()}>call readState</button>
      <button style={{ color: 'green' }} onClick={() => srv.readProps()}>call readProps</button><br />
      <button style={{ color: 'green' }} onClick={() => srv.changeNum()}>call changeNum</button><br />
      <button style={{ color: 'red' }} onClick={() => srv2.readState()}>call readState</button>
      <button style={{ color: 'red' }} onClick={() => srv2.readProps()}>call readProps</button>
      <h3>state num {obj.num}</h3>
      <h3>props num {props.num}</h3>
      <Child srv={srv} name="Statble" />
      <Child srv={srv2} name="Unstatble" />
    </MarkUpdate>
  );
}

function Demo() {
  const [obj, setObj] = useObject({ num: 1 });

  return <div>
    <button onClick={() => setObj({ num: random() })}>change num</button>
    <Comp num={obj.num} />
  </div>
}

export default Demo;
