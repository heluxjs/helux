import '../testSetup';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { run, useConcent, register, getGlobalState, getGlobalComputed } from '../../src/index';

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
const runOptions = { logError: false, act };

function makeComp(isFnComp, regParams, View) {
  const Comp = isFnComp
    ? () => {
      const ctx = useConcent(regParams);
      return <View ctx={ctx} />
    } : register(regParams)(
      class extends React.Component {
        render() {
          return <View ctx={this.ctx} />
        }
      }
    );

  return Comp;
}

export default function startTest(describeTitle, isFnComp = true) {
  run(models, runOptions);
  
  describe(describeTitle, () => {
    test('call with null param', () => {
      const Comp = makeComp(isFnComp, null, ({ ctx: { state } }) => {
        return <h1>{state.code}</h1>;
      });
      const wrap = mount(<Comp />);
      const h1Wrap = wrap.find('h1');
      expect(h1Wrap.text()).toBe('x');
    });


    test('call with undefined param', () => {
      const Comp = makeComp(isFnComp, undefined, ({ ctx: { state } }) => {
        return <h1>{state.code}</h1>;
      });
      const wrap = mount(<Comp />);
      const h1Wrap = wrap.find('h1');
      expect(h1Wrap.text()).toBe('x');
    });


    test('call with param like (module:string)', () => {
      const Comp = makeComp(isFnComp, 'test', ({ ctx: { state } }) => {
        return <h1>{state.num}</h1>;
      });
      const wrap = mount(<Comp />);
      const h1Wrap = wrap.find('h1');
      expect(h1Wrap.text()).toBe(String(1));
    });


    test('call with param like (input:{module:string})', () => {
      const Comp = makeComp(isFnComp, { module: 'test' }, ({ ctx: { state } }) => {
        return <h1>{state.num}</h1>;
      });
      const wrap = mount(<Comp />);
      const h1Wrap = wrap.find('h1');
      expect(h1Wrap.text()).toBe(String(1));
    });


    test('call with param like (input:{module:string, connect:string[]})', () => {
      const Comp = makeComp(isFnComp, { module: 'test', connect: ['test2'] }, ({ ctx: { state, connectedState } }) => {
        return (
          <div>
            <h1>{state.num}</h1>
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


    test('call with param like (input:{connect:string[]})', () => {
      const Comp = makeComp(isFnComp, { connect: ['test', 'test2'] }, ({ ctx: { connectedState } }) => {
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
  });


    test('call with param like (input:{setup:Function})', () => {
      const setup = ctx => {
        const { initState, state, setState } = ctx;
        initState({ privNum: 100 });
        return {
          addPrivNum: () => setState({ privNum: state.privNum + 1 }),
        };
      };
      const Comp = makeComp(isFnComp, { setup }, ({ ctx: { state, settings } }) => {
        return (
          <div>
            <h1>{state.privNum}</h1>
            <button onClick={settings.addPrivNum}>addPrivNum</button>
          </div>
        );
      });
      const wrap = mount(<Comp />);
      const h1Wrap = wrap.find('h1');
      const btnWrap = wrap.find('button');
      expect(h1Wrap.text()).toBe(String(100));
      act(() => {
        btnWrap.simulate('click');
      });
      expect(h1Wrap.text()).toBe(String(101));
    });


  test('no matter how regParams like, comp should read global state and global computed', () => {
    const Comp = makeComp(isFnComp, null, ({ ctx: { globalState, globalComputed } }) => {
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
}
