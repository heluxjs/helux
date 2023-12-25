import { $, share, useWatch, useObject } from 'helux';
import React from 'react';
import { MarkUpdate, Entry } from './comps';
import { random, delay } from "./logic/util";

const [sharedState, setState, ctx] = share({ a: 1, b: { b1: { b2: 200 } } }, { moduleName: 'UseWatch' });

function changeA() {
  setState((draft) => {
    draft.a += 1;
  });
}

function Comp(props: any) {
  const [obj, setObj] = useObject({ num: 1 });
  useWatch(() => {
    console.log('sharedState.a changed, here can read latest num', obj.num);
  }, () => [sharedState.a]);

  return (
    <MarkUpdate>
      <button onClick={() => setObj({ num: random() })}>change local num</button>
      <div> num is {obj.num}</div>
      shared.xxx {$(sharedState.a)}
    </MarkUpdate>
  );
}

function Comp2(props: any) {
  const [obj, setObj] = useObject({ num: 1 });
  useWatch(() => {
    console.log('sharedState.a changed, here can read latest num', obj.num);
  }, { deps: () => [sharedState.a], immediate: true });

  return (
    <MarkUpdate>
      <button onClick={() => setObj({ num: random() })}>change local num</button>
      <div> num is {obj.num}</div>
      shared.xxx {$(sharedState.a)}
    </MarkUpdate>
  );
}

const Demo = () => (
  <Entry fns={[changeA]}>
    <Comp num={random()} />
    <Comp2 num={random()} />
  </Entry>
);

export default Demo;
