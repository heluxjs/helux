import { useStable, useObject } from 'helux';
import React from 'react';
import { MarkUpdate, Entry } from '../comps';
import { random, delay } from "../logic/util";

const Child = React.memo((props: any) => {
  console.log('Render Child');
  return <MarkUpdate forceColor={true}>
    {props.name} Child
  </MarkUpdate>
});

function Comp(props: any) {
  const [obj, setObj] = useObject({ num: 1 });

  // 生成稳定的对象，对象的所有方法将转为稳定引用，且回调里始终可以读到外部的最新值，无闭包陷阱
  const srv = useStable({
    readState() {
      console.log(`%c read state num ${obj.num}`, `color:green`);
    },
    readProps() {
      console.log(`%c read props num ${props.num}`, `color:green`);
    },
    changeState() {
      setObj({ num: random() });
    },
  });

  // 传入值，则只是返回最新值
  const numTwo = useStable(2);

  // 如传入单函数，则返回的稳定的函数引用
  const fn = useStable(() => {
    console.log(`%c read state num ${obj.num}`, `color:green`);
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
      <button onClick={() => setObj({ num: random() })}>change state num</button>
      <button onClick={srv.changeState}>change state num by srv.changeState</button><br />
      <button style={{ color: 'green' }} onClick={srv.readState}>call readState</button>
      <button style={{ color: 'green' }} onClick={srv.readProps}>call readProps</button>
      <button style={{ color: 'green' }} onClick={fn}>call readState of fn</button><br />
      <button style={{ color: 'red' }} onClick={srv2.readState}>call readState</button>
      <button style={{ color: 'red' }} onClick={srv2.readProps}>call readProps</button>
      <h3>state num {obj.num}</h3>
      <h3>props num {props.num}</h3>
      <h3>numTwo {numTwo}</h3>
      <Child srv={srv} name="Statble 1" />
      <Child srv={fn} name="Statble 2" />
      <Child srv={srv2} name="Unstatble" />
    </MarkUpdate>
  );
}

function Demo() {
  const [obj, setObj] = useObject({ num: 1 });

  return <div>
    <button onClick={() => setObj({ num: random() })}>change props num</button>
    <Comp num={obj.num} />
  </div>
}

export default Demo;
