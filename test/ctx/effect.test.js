/** @typedef {import('../../src/types-inner').IRefCtx} Ctx */
import React from 'react';
import '../testSetup';
import { run, useConcent, register } from '../../src/index';
import { getTestModels, mountCompThenTestValue } from '../util';

const models = getTestModels();
run(models, { logError: false });


export function makeComp(module, setup) {
  const View = ({ state, changeNum }) => {
    return (
      <div>
        <h1 className="didMount">{state.didMount}</h1>
        <h1 className="num">{state.num}</h1>
        <h1 className="numBig">{state.numBig}</h1>
        <button onClick={changeNum}>changeNum</button>
      </div>
    );
  };

  const CompFn = () => {
    const { state, setState } = useConcent({ module, setup });
    const changeNum = () => setState({ num: 20 });
    return <View state={state} changeNum={changeNum} />;
  };
  const CompCls = register({ module, setup })(
    class extends React.Component {
      changeNum = () => this.setState({ num: 20 }); // or this.ctx.setState
      render() {
        const { state } = this.ctx;
        return <View state={state} changeNum={this.changeNum} />;
      }
    }
  );
  const CompClsWithConstChangeNum = register({ module, setup })(
    class extends React.Component {
      render() {
        const { state, setState } = this.ctx;
        const changeNum = () => setState({ num: 20 });
        return <View state={state} changeNum={changeNum} />;
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
    mountCompThenTestValue(CompFn, compareItems);
    mountCompThenTestValue(CompCls, compareItems);
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
    mountCompThenTestValue(CompFn, compareItems, options);
    mountCompThenTestValue(CompCls, compareItems, options);
    mountCompThenTestValue(CompClsWithConstChangeNum, compareItems, options);
  });


});
