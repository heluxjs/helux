import '../testSetup';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { run, connect, connectDumb, getGlobalState, getGlobalComputed } from '../../src/index';

const models = {
  // overwrite build-in $$default module state
  $$default: {
    state: { code: 'x' },
  },
  // overwrite build-in $$global module state
  $$global: {
    state: { theme: 'red' },
    computed: {
      theme: ({ theme }) => `hi_${theme}`,
    },
  },
  test: {
    state: { num: 1 },
  },
  test2: {
    state: { num: 100 },
  },
};
const runOptions = { log: false, act };

function makeComp(isDumb, connList, View) {
  const Comp = isDumb
    ? connectDumb(connList)(ctx => <View ctx={ctx} />)
    : connect(connList)(
      class extends React.Component {
        render() {
          return <View ctx={this.ctx} />
        }
      }
    );
  return Comp;
}

export default function startTest(describeTitle, isDumb = false) {
  run(models, runOptions);

  describe(describeTitle, () => {
    test('call with null param', () => {
      const Comp = makeComp(isDumb, null, ({ ctx: { state } }) => {
        return <h1>{state.code}</h1>;
      });
      const wrap = mount(<Comp />);
      const h1Wrap = wrap.find('h1');
      expect(h1Wrap.text()).toBe('x');
    });


    test('call with undefined param', () => {
      const Comp = makeComp(isDumb, undefined, ({ ctx: { state } }) => {
        return <h1>{state.code}</h1>;
      });
      const wrap = mount(<Comp />);
      const h1Wrap = wrap.find('h1');
      expect(h1Wrap.text()).toBe('x');
    });


    test('connect one module', () => {
      const Comp = makeComp(isDumb, ['test'], ({ ctx: { connectedState: { test: state } } }) => {
        return <h1>{state.num}</h1>;
      });
      const wrap = mount(<Comp />);
      const h1Wrap = wrap.find('h1');
      expect(h1Wrap.text()).toBe(String(1));
    });


    test('connect 2 modules', () => {
      const Comp = makeComp(isDumb, ['test', 'test2'], ({ ctx: { connectedState } }) => {
        return (
          <div>
            <h1>{connectedState.test.num}</h1>
            <h2>{connectedState.test2.num}</h2>
          </div>
        );
      });
      const wrap = mount(<Comp />);
      const h1Wrap = wrap.find('h1');
      const h2Wrap = wrap.find('h2');
      expect(h1Wrap.text()).toBe(String(1));
      expect(h2Wrap.text()).toBe(String(100));
    });


    test('no matter pass $$global or not, comp should read global state and global computed correctly', () => {
      const Comp = makeComp(isDumb, null, ({ ctx: { globalState, globalComputed } }) => {
        return (
          <div>
            <h1>{globalState.theme}</h1>
            <h2>{globalComputed.theme}</h2>
          </div>
        );
      });
      const wrap = mount(<Comp />);
      const h1Wrap = wrap.find('h1');
      const h2Wrap = wrap.find('h2');
      expect(h1Wrap.text()).toBe(getGlobalState().theme);
      expect(h2Wrap.text()).toBe(getGlobalComputed().theme);
    });
  })
}
