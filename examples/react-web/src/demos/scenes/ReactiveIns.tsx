import * as helux from 'helux';
import React from 'react';
import { MarkUpdate, Entry } from '../comps';
import { dictFactory } from "../logic/util";

const { share, atom, useReactive } = helux;
const [shared, , sctx] = share(dictFactory);
const [atomDict, , ctx] = atom(dictFactory);

function updateC1() {
  sctx.reactive.a.b.c++;
  sctx.reactive.a.b.c++;
  sctx.reactive.a.b.c++;
}
function Info1() {
  const [reactiveShared] = useReactive(shared);
  React.useEffect(() => {
    // setInterval(() => reactiveShared.a.b.c++, 1000);
  }, []);
  const add = () => reactiveShared.a.b.c++;

  return <MarkUpdate>
    <button onClick={add}>add</button>
    <h2>reactiveShared.a.b.c {reactiveShared.a.b.c}</h2>
  </MarkUpdate>;
}

function updateC2() {
  ctx.reactive.a.b.c++;
  ctx.reactive.a.b.c++;
  ctx.reactive.a.b.c++;
}

function Info2() {
  const [reactiveAtom] = useReactive(atomDict);
  React.useEffect(() => {
    // setInterval(() => reactiveShared.val.a.b.c++, 1000);
  }, []);
  const add = () => reactiveAtom.a.b.c++;

  return <MarkUpdate>
    <button onClick={add}>add</button>
    <h2>reactiveAtom.a.b.c {reactiveAtom.a.b.c}</h2>
  </MarkUpdate>;
}

function InfoRead() {
  const [reactiveAtom] = useReactive(atomDict);
  const add = () => reactiveAtom.a.b.c++;
  return <MarkUpdate>
    <button onClick={add}>add</button>
    <h2>reactiveAtom.a.b.c {reactiveAtom.a.b.c}</h2>
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

