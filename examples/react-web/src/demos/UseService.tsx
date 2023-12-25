import { share, useService, useAtom, storeSrv } from 'helux';
import React from 'react';
import { MarkUpdate, Entry } from './comps';

const [priceState, setPrice, ctx] = share({ a: 1, b: 100 });

const changeA = ctx.action<number>()((params) => {
  params.draft.a += params.payload;
}, 'changeA');


function useSomeLogic(props: { a: number }) {
  const [state, setState] = useAtom(priceState);
  const srv = useService({
    someCall() {
      console.log('props.a', props.a);
      // ...
      changeA(props.a);
    },
    sayHello(tip: string) {
      console.log(tip);
    },
    state,
    setState,
  }, props);
  return srv;
}

function GrandFather(props: any) {
  const srvRef = React.useRef<any>(null);

  return <div>
    <button onClick={() => { srvRef.current?.sayHello('from GrandFather') }}>call child fn</button>
    {/* <Father a={1} srvRef={(srv: any) => srvRef.current = srv} /> */}
    <Father a={1} srvRef={storeSrv(srvRef)} />
  </div>
}

function Father(props: any) {
  return <div>
    Father comp:
    <Comp a={1} srvRef={props.srvRef} />
  </div>
}

function Comp(props: { a: number, srvRef?: any }) {
  const { state, someCall } = useSomeLogic(props);
  return (
    <MarkUpdate>
      <div>state.a {state.a}</div>
      <div>state.b {state.b}</div>
      <button onClick={someCall}>someCall</button>
    </MarkUpdate>
  );
}

const Demo = () => (
  <Entry>
    <GrandFather />
    <Comp a={1} />
  </Entry>
);

export default Demo;
