import '../testSetup';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { run, useConcent, register, getState, getComputed } from '../../src/index';
import { delay, getWrapNum } from '../util';

const key2Idx = {};
const numList = [100, 200, 300];
function getNum(key) {
  let idx = key2Idx[key];
  if (!idx) {
    key2Idx[key] = 0;
    idx = key2Idx[key];
  }
  const num = numList[idx];
  key2Idx[key]++;
  return num;
}

run({
  test: {
    state: { num: 1 },
    lifecycle: {
      mounted(dispatch) {
        dispatch('setState', { num: getNum('test') })
      }
    },
  },
  test2: {
    state: { num: 1 },
    lifecycle: {
      mounted(dispatch) {
        dispatch('setState', { num: getNum('test2') });
        return false;
      },
      willUnmount(dispatch){
        dispatch('setState', { num: 0 });
        return false;
      },
    },
  },
  test3: {
    state: { num: 1, numBig: 100 },
    computed: {
      numx2: ({ num }) => num * 2,
      numx10PlusNumBig: ({ numBig }, o, f) => 5 * f.cuVal.numx2 + numBig,
    },
    lifecycle: {
      async initState() {
        await delay(1000);
        return { num: 100 };
      },
    },
  },
}, { log: false, act }); // pass act to runOptions to avoid act warning in test mode

describe('test top api run with react component', () => {
  test('module computed should work', () => {
    expect(getComputed('test3').numx2).toBe(2);
    expect(getComputed('test3').numx10PlusNumBig).toBe(110);
  });


  test('component ins should read module computed', () => {
    const View = ({ moduleComputed }) => (
      <div>
        <h1>{moduleComputed.numx2}</h1>
        <h2>{moduleComputed.numx10PlusNumBig}</h2>
      </div>
    );
    const CompCls = register('test3')(
      class extends React.Component {
        render() {
          return <View moduleComputed={this.ctx.moduleComputed} />;
        }
      });
    const CompFn = () => {
      const { moduleComputed } = useConcent('test3');
      return <View moduleComputed={moduleComputed} />;
    };

    const compClsWrap = mount(<CompCls />);
    const compFnWrap = mount(<CompFn />);
    const numx2 = getComputed('test3').numx2;
    const numx10PlusNumBig = getComputed('test3').numx10PlusNumBig;

    expect(numx2).toBe(getWrapNum(compClsWrap, 'h1'));
    expect(numx2).toBe(getWrapNum(compFnWrap, 'h1'));
    expect(numx10PlusNumBig).toBe(getWrapNum(compClsWrap, 'h2'));
    expect(numx10PlusNumBig).toBe(getWrapNum(compFnWrap, 'h2'));
  });


  test('when the fisrt ins of class component mounted, it should trigger lifecyle.mounted only one time', () => {
    const CompCls = register('test')(
      class extends React.Component {
        render() {
          return <h1>{this.state.num}</h1>
        }
      }
    );
    const CompFn = () => {
      const { state } = useConcent('test');
      return <h1>{state.num}</h1>
    };

    const wrap = mount(<CompCls />);
    const h1Wrap = wrap.find('h1');
    expect(h1Wrap.text()).toBe(String(100));

    // mount another instance
    const wrap2nd = mount(<CompCls />);
    const h1Wrap2nd = wrap2nd.find('h1');
    // still 100
    expect(h1Wrap2nd.text()).toBe(String(100));

    // unmount all ins, then mount one
    wrap.unmount();
    wrap2nd.unmount();
    const wrap3th = mount(<CompFn />);
    const h1Wrap3th = wrap3th.find('h1');
    expect(h1Wrap3th.text()).toBe(String(100));
  });


  test('lifecyle.mounted and willUnmount will been called multi times when it returns false', () => {
    const CompCls = register({ module: 'test2' })(
      class extends React.Component {
        render() {
          return <h1>{this.state.num}</h1>
        }
      }
    );
    const CompFn = () => {
      const { state } = useConcent({ module: 'test2' });
      return <h1>{state.num}</h1>
    };

    const wrap = mount(<CompCls />);
    const h1Wrap = wrap.find('h1');
    expect(h1Wrap.text()).toBe(String(100));

    // mount another instance
    const wrap2nd = mount(<CompCls />);
    const h1Wrap2nd = wrap2nd.find('h1');
    // still 100
    expect(h1Wrap2nd.text()).toBe(String(100));

    // mount a instance of function component
    const wrapfn = mount(<CompFn />);
    const h1Wrapfn = wrapfn.find('h1');
    expect(h1Wrapfn.text()).toBe(String(100));

    // make sure all ins unmount, and then concent will call willUnmount
    wrap.unmount();
    wrap2nd.unmount();
    wrapfn.unmount();
    expect(getState('test2').num).toBe(0);

    const wrap3th = mount(<CompCls />);
    const h1Wrap3th = wrap3th.find('h1');
    expect(getState('test2').num).toBe(200);
    // now it is 200
    expect(h1Wrap3th.text()).toBe(String(200));

    wrap3th.unmount();
    expect(getState('test2').num).toBe(0);
  });


  test('async lifecyle.initState will re-render comp-ins', async() => {
    const CompCls = register('test3')(
      class extends React.Component {
        render() {
          return <h1>{this.state.num}</h1>
        }
      }
    );
    const CompFn = () => {
      const ctx = useConcent('test3');
      return <h1>{ctx.state.num}</h1>
    };
    const wrap = mount(<CompCls />);
    const wrap2 = mount(<CompFn />);

    await delay(500);
    expect(getState('test3').num).toBe(1);
    const h1Wrap = wrap.find('h1');
    expect(h1Wrap.text()).toBe(String(1));

    const h1Wrap2 = wrap2.find('h1');
    expect(h1Wrap2.text()).toBe(String(1));

    await delay(1500);
    // after initState invoked
    expect(getState('test3').num).toBe(100);
    expect(h1Wrap.text()).toBe(String(100));
    expect(h1Wrap2.text()).toBe(String(100));
  });
});
