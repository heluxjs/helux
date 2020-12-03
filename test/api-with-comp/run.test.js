import React from 'react';
import { mount } from 'enzyme';
import '../testSetup';
import { run, useConcent, register, getState } from '../../src/index';

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
  }
}, { logError: false });

describe('test top api run with react component', () => {
  test('when a fisrt ins of class component mounted, it should trigger lifecyle.mounted only one time', () => {
    const CompCls = register({ module: 'test' })(
      class extends React.Component {
        render() {
          return <h1>{this.state.num}</h1>
        }
      }
    );
    const wrap = mount(<CompCls />);
    const h1Wrap = wrap.find('h1');
    expect(h1Wrap.text()).toBe(String(100));

    // mount another instance
    const wrap2nd = mount(<CompCls />);
    const h1Wrap2nd = wrap2nd.find('h1');
    // still 100
    expect(h1Wrap2nd.text()).toBe(String(100));
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
});
