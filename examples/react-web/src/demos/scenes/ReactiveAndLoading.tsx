import { share, atom, useReactive } from 'helux';
import React from 'react';
import { MarkUpdate, Entry } from '../comps';
import { dictFactory, delay } from "../logic/util";

const [shared, , sctx] = share(dictFactory, { moduleName: 'ReactiveAndLoding' });
const [atomDict, , ctx] = atom(dictFactory);
const { reactive } = sctx;

const { actions, useLoading } = ctx.defineActions()({
  async asyncAdd({draft}){
    await delay(3000);
    draft.a.b.c++;
  }
});

async function updateC1() {
  reactive.a.b.c++;
  reactive.a.b.c++;
  reactive.a.b.c++;
  reactive.loading = true;
  await delay(3000);
  reactive.loading = false;
}
function Info1() {
  const [reactiveShared ] = useReactive(shared);
  React.useEffect(() => {
    // setInterval(() => reactiveShared.a.b.c++, 1000);
  }, []);
  const add = () => reactiveShared.a.b.c++;
  const asyncAdd = async () => {
    await delay(1000);
    reactiveShared.a.b.c++;
  }

  return <MarkUpdate>
    <button onClick={add}>add</button>
    {/* <button onClick={actions.}>asyncAdd</button> */}
    <h3>{reactiveShared.loading ? '....' : 'done'}</h3>
    <h2>reactiveShared.a.b.c {reactiveShared.a.b.c}</h2>
  </MarkUpdate>;
}

function updateC2() {
  ctx.reactive.a.b.c++;
  ctx.reactive.a.b.c++;
  ctx.reactive.a.b.c++;
}

function Info2() {
  const [reactiveShared] = useReactive(atomDict);
  React.useEffect(() => {
    // setInterval(() => reactiveShared.val.a.b.c++, 1000);
  }, []);
  const add = () => reactiveShared.a.b.c++;
  const asyncAdd = async () => {
    await delay(1000);
    reactiveShared.a.b.c++;
  }

  return <MarkUpdate>
    <button onClick={add}>add</button>
    <button onClick={asyncAdd}>asyncAdd</button>
    <h2>atomDict.a.b.c {reactiveShared.a.b.c}</h2>
  </MarkUpdate>;
}

function InfoRead() {
  const [reactiveShared] = useReactive(atomDict);
  const add = () => reactiveShared.a.b.c++;
  const asyncAdd = async () => {
    await delay(1000);
    reactiveShared.a.b.c++;
  }
  return <MarkUpdate>
    <button onClick={add}>add</button>
    <button onClick={asyncAdd}>asyncAdd</button>
    <h2>atomDict.a.b.c {reactiveShared.a.b.c}</h2>
  </MarkUpdate>;
}


const Demo = () => (
  <Entry fns={[updateC1, updateC2]}>
    <Info1 />
    <Info1 />
    <Info2 />
    <InfoRead />
    <InfoRead />
  </Entry>
);

export default Demo;

