import React from 'react';
import { $, share, useLocalForceUpdate } from 'helux';
import { MarkUpdate, Entry } from '../comps';
import { dictFactory, delay } from '../logic/util';

const [priceState, , ctxp] = share(dictFactory, { moduleName: 'DefineApi3', alertDeadCycleErr: false });

const ms = ctxp.defineMutateSelf()({
  toBeDrive: (draft, params) => {
    console.error('trigger toBeDrive');
    draft.extra.toBeDrive = params.state.a.b.c + 1000;
  },
  prefixedMark: (draft) => draft.extra.prefixedMark = draft.desc + 'xx',
  changeB: {
    deps: () => [priceState.info.name],
    async task(params) {
      console.error('should trigger task');
      await delay(1000);
      params.draft.extra.newName = params.input[0] + Date.now();
    },
  }
});

// 这个改动应该触发 changeB task，修改 newName
function changeNameByReactive() {
  ctxp.reactive.info.name = `${Date.now()}_`;
}
function changeNameByTopSetState() {
  ctxp.setState((draft) => {
    draft.info.name = `${Date.now()}_`;
  });
}

function changeC() {
  ctxp.setState(draft => { draft.a.b.c += 100 });
}

function Price() {
  console.log('Render Price');
  const [state, setState] = ctxp.useState();
  const [reactive] = ctxp.useReactive();
  const update = useLocalForceUpdate();
  const [s, setS] = React.useState(100);
  const update2 = () => {
    setS(s + 1);
  };
  const ld = ms.useLoading();
  const changeNameByInsSetState = () => {
    setState((draft) => {
      draft.info.name = `${Date.now()}_`;
    });
  };
  const changeNameByInsReactive = () => {
    reactive.info.name = `${Date.now()}_`;
  };

  return <MarkUpdate name="Price">
    <h3>extra.prefixedMark: {state.extra.prefixedMark}</h3>
    <h3>extra.toBeDrive: {state.extra.toBeDrive}</h3>
    <h3>extra.newName: {state.extra.newName} {ld.changeB.loading ? 'loading...' : ''}</h3>
    <button onClick={changeNameByInsSetState}>changeNameByInsSetState</button>
    <button onClick={changeNameByInsReactive}>changeNameByInsReactive</button>
    <button onClick={update}>forceUpdate</button>
    <button onClick={update2}>forceUpdate2</button>
    <h4>{s}</h4>
  </MarkUpdate>;
}

const Demo = () => (
  <Entry fns={[changeC, changeNameByReactive, changeNameByTopSetState]}>
    <Price />
    <Price />
    <h3>priceState.a.b.c: {$(priceState.a.b.c)}</h3>
    <h3>ctxp.reactive.info.name: {$(ctxp.reactive.info.name)}</h3>
    <h3>priceState.info.name: {$(priceState.info.name)}</h3>
    <h3>priceState.extra.newName: {$(priceState.extra.newName)}</h3>
  </Entry>
);

export default Demo;
