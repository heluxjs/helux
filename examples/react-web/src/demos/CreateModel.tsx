import React from 'react';
import { $, model, modelFactory } from 'helux';
import { MarkUpdate, Entry } from './comps';

const myModel = model((api) => {
  const userCtx = api.sharex({ a: 1, b: 2 });
  const { state, setState } = userCtx;
  const someResult = api.derive(() => state.a + 100);

  function changeA() {
    setState((draft) => {
      draft.a += 1;
    });
  }

  return {
    changeA,
    state,
    someResult,
    setState,
  }
});

const factory = modelFactory((api, extra) => {
  console.log('received build extra param ', extra)
  const userCtx = api.sharex({ a: 1, b: 2 }, { moduleName: extra });
  const { state, setState } = userCtx;
  const someResult = api.derive(() => state.a + 100);

  function changeA() {
    setState((draft) => {
      draft.a += 1;
    });
  }

  return {
    changeA,
    state,
    someResult,
    setState,
  }
});
const model1 = factory.build('Model1');
const model2 = factory.build('Model2');

function Comp() {
  return (
    <MarkUpdate>
      <div>model.state.a {$(myModel.state.a)}</div>
      <div>model1.state.a {$(model1.state.a)}</div>
      <div>model1.state.a {$(model2.state.a)}</div>
    </MarkUpdate>
  );
}

const Demo = () => (
  <Entry fns={[myModel.changeA, model1.changeA, model2.changeA]}>
    <Comp />
  </Entry>
);

export default Demo;
