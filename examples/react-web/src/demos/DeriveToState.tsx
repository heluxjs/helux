import React from 'react';
import {
  useAtom, share, watch, useDerived,
  deriveDict, runDerive, runDeriveTask,
} from 'helux';
import * as util from './logic/util';
import { MarkUpdate, Entry } from './comps';


const ori = { a: 50, doubleA: 0, b: 2, c: { c1: 100, c2: 1000 }, list: [{ name: 'one', age: 1 }] };
const [ret, setState, call] = share(ori, { moduleName: 'd2s' });

watch(() => {
  const { a } = ret;
  setState(draft => { draft.doubleA = a * 2 });
}, () => [ret.a]);

const coolWrap = deriveDict(() => {
  const { doubleA } = ret;
  return { cool: doubleA + 19 }
});

const outRet = deriveDict({
  deps: () => [ret.doubleA] as const,
  fn: () => ({ val: 0 + util.random() }),
  task: async ({ input: [doubleA] }) => {
    await util.delay();
    return { val: doubleA + 100 + util.random() };
  },
  immediate: true,
});

// @ts-ignore
const rerun = () => runDerive(outRet);
const rerunAsync = () => runDeriveTask(outRet);

function change_a() {
  setState(draft => {
    draft.a = util.random();
  });
  console.log('ret.a', ret.a);
  console.log('ret.doubleA', ret.doubleA);
}

function SharedA() {
  console.log('Render A', ret);
  const [state] = useAtom(ret);
  return (
    <div>
      {state.a}
    </div>
  );
}

function DoubleA() {
  console.log('Render DoubleA');
  const [state] = useAtom(ret);
  return (
    <div>
      state.doubleA：{state.doubleA}
    </div>
  );
}

function ReadCool() {
  console.log('Render ReadCool');
  const [coolCu] = useDerived(coolWrap);
  return (
    <div>
      read coolWrap val: {coolCu.cool}
    </div>
  );
}


function UseDerived() {
  // const [outData, status] = useDerived(outRet, { showLoading:  });
  const [outData, status] = useDerived(outRet);
  return (
    <div>
      outRet.val: {outData.val}
      <div>{status.loading ? 'loading...' : ''}</div>
    </div>
  );
}

function Demo(props: any) {
  return <Entry fns={[change_a, rerun, rerunAsync]}>
    <SharedA />
    <DoubleA />
    <ReadCool />
    <UseDerived />
  </Entry>
}

export default Demo;
