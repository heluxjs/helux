/** @typedef {import('../../src/types-inner').IRefCtx} Ctx */
import React from 'react';
import '../testSetup';
import { run, useConcent, register } from '../../src/index';
import { okeys } from '../../src/support/util';
import { getTestModels, mountCompThenAssertValue } from '../util';

const models = getTestModels();
run(models, { logError: false });


export function makeComp(module, setup) {
  const View = ({ state, changeNum, settings }) => {
    return (
      <div>
        <h1 className="didMount">{state.didMount}</h1>
        <h1 className="num">{state.num}</h1>
        <h1 className="numBig">{state.numBig}</h1>
        <button onClick={changeNum}>changeNum</button>
        {okeys(settings).map(key => <button key={key} className={key} onClick={settings[key]}>key</button>)}
      </div>
    );
  };

  const CompFn = () => {
    const { state, setState, settings } = useConcent({ module, setup });
    const changeNum = () => setState({ num: 20 });
    return <View state={state} changeNum={changeNum} settings={settings} />;
  };
  const CompCls = register({ module, setup })(
    class extends React.Component {
      changeNum = () => this.setState({ num: 20 }); // or this.ctx.setState
      render() {
        const { state, settings } = this.ctx;
        return <View state={state} changeNum={this.changeNum} settings={settings} />;
      }
    }
  );
  const CompClsWithConstChangeNum = register({ module, setup })(
    class extends React.Component {
      render() {
        const { state, setState, settings } = this.ctx;
        const changeNum = () => setState({ num: 20 });
        return <View state={state} changeNum={changeNum} settings={settings} />;
      }
    }
  );

  return { CompFn, CompCls, CompClsWithConstChangeNum };
}

describe('test ctx api effect', () => {
  test('mock didMount', () => {
    const setup = (ctx) => {
      ctx.initState({ didMount: '' });
      ctx.effect(() => {
        ctx.setState({ didMount: 'didMount' });
      }, []);
    };
    const { CompFn, CompCls } = makeComp('test', setup);

    const compareItems = [
      { key: 'didMount', compareValue: 'didMount', eq: true },
    ];
    mountCompThenAssertValue(CompFn, compareItems);
    mountCompThenAssertValue(CompCls, compareItems);
  });


  test('num changing should trigger effect', () => {
    const setup = (/** @type Ctx */ctx) => {
      ctx.initState({ didMount: '', num: 1, numBig: 10 });
      ctx.effect(() => {
        if (ctx.state.num === 20) {
          ctx.setState({ numBig: 10000 });
        } else {
          ctx.setState({ numBig: 100 });
        }
      }, ['num']);
    };
    const { CompFn, CompCls, CompClsWithConstChangeNum } = makeComp('test', setup);

    const compareItems = [
      { key: 'numBig', compareValue: 10000, eq: true, valueType:'number' },
    ];
    const options = {
      clickAction: (compWrap) => {
        const buttonWrap = compWrap.find('button');
        buttonWrap.simulate('click');
      },
    };
    mountCompThenAssertValue(CompFn, compareItems, options);
    mountCompThenAssertValue(CompCls, compareItems, options);
    mountCompThenAssertValue(CompClsWithConstChangeNum, compareItems, options);
  });


  test('when immediate is true, effect should not work in frist render', () => {
    const setup = (/** @type Ctx */ctx) => {
      ctx.initState({ didMount: '', num: 1, numBig: 10 });
      ctx.effect(() => {
        ctx.setState({ numBig: 100 });
      }, { depKeys: ['num'], immediate: false }); // default is true
    };
    const { CompFn, CompCls, CompClsWithConstChangeNum } = makeComp('test', setup);

    const compareItems = [
      { key: 'numBig', compareValue: 10, eq: true, valueType:'number' },
    ];
    mountCompThenAssertValue(CompFn, compareItems);
    mountCompThenAssertValue(CompCls, compareItems);
    mountCompThenAssertValue(CompClsWithConstChangeNum, compareItems);
  });


  const testCompareLogicWithDifferentValue = (compare, shouldBe) => {
    const setup = (/** @type Ctx */ctx) => {
      ctx.initState({ didMount: '', num: 1, numBig: 10, info: { addr: 'bj' } });
      ctx.effect(
        () => {
          ctx.setState({ numBig: 100 });
        },
        // default compare is true， set immediate false to avoid trigger this effect at first render
        { depKeys: ['info'], compare, immediate: false }
      ); 

      return {
        changeInfo() {
          const { info } = ctx.state;
          info.addr = 'newAddr';
          ctx.setState({ info });
        },
      };
    };
    const { CompFn, CompCls, CompClsWithConstChangeNum } = makeComp('test', setup);

    const compareItems = [
      { key: 'numBig', compareValue: shouldBe, eq: true, valueType:'number' },
    ];
    const options = {
      clickAction: (compWrap) => {
        const buttonWrap = compWrap.find('button.changeInfo');
        buttonWrap.simulate('click');
      },
    };
    mountCompThenAssertValue(CompFn, compareItems, options);
    mountCompThenAssertValue(CompCls, compareItems, options);
    mountCompThenAssertValue(CompClsWithConstChangeNum, compareItems, options);
  };
  test('when compare is false, effect should work even pass the same ref in partial state', () => {
    testCompareLogicWithDifferentValue(false, 100);
  });
  test('when compare is true, effect should not work if pass the same ref in partial state', () => {
    testCompareLogicWithDifferentValue(true, 10);
  });
});
