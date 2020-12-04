import React from 'react';
import { mount } from 'enzyme';
import '../testSetup';
import { run, useConcent, getState, register } from '../../src/index';
import { getTestModels, mountCompThenAssertValue, makeComp } from '../util';

const models = getTestModels();
run(models, { log: false });


describe('test ctx api initState', () => {
  test('initState should not overwrite test module state when passed object includes module state key', () => {
    const setup = (ctx) => {
      ctx.initState({ name: 'nameNew' });
    };
    const { CompFn, CompCls } = makeComp('test', setup);

    const compareItems = [
      { key: 'name', compareValue: getState('test').name, eq: true },
    ];
    mountCompThenAssertValue(CompFn, compareItems);
    mountCompThenAssertValue(CompCls, compareItems);
  });


  test('allow pass a new state with object style', () => {
    const privName = 'privName';
    const setup = (ctx) => {
      ctx.initState({ privName });
    };
    const { CompFn, CompCls } = makeComp('test', setup);

    const compareItems = [
      { key: 'privName', compareValue: privName, eq: true },
    ];
    mountCompThenAssertValue(CompFn, compareItems);
    mountCompThenAssertValue(CompCls, compareItems);
  });

  
  test('allow pass a new state with fn style', () => {
    const privName = 'privName';
    const setup = (ctx) => {
      ctx.initState(() => ({ privName }));
    };
    const { CompFn, CompCls } = makeComp('test', setup);

    const compareItems = [
      { key: 'privName', compareValue: privName, eq: true },
    ];
    mountCompThenAssertValue(CompFn, compareItems);
    mountCompThenAssertValue(CompCls, compareItems);
  });


  test('pass a object that include module state key and non-module state key both', () => {
    const nameNewForModule = 'it will not work';
    const nameNewForPriv = 'it not work';
    const setup = (ctx) => {
      ctx.initState({ privName: nameNewForPriv, name: nameNewForModule });
    };

    const { CompFn, CompCls } = makeComp('test', setup);
    const compareItems = [
      { key: 'privName', compareValue: nameNewForPriv, eq: true },
      { key: 'name', compareValue: nameNewForModule, eq: false },
    ];
    mountCompThenAssertValue(CompFn, compareItems);
    mountCompThenAssertValue(CompCls, compareItems);
  });


  test('initState should trigger ref computed', () => {
    const $privName = 'privName';
    const setup = (ctx) => {
      ctx.initState({ $privName });
      ctx.computed('$privName', ({ $privName }) => {
        return `cu_${$privName}`;
      });
    };

    const testH1Text = (CompFn) => {
      const compWrap = mount(<CompFn />);
      const h1Wrap = compWrap.find('h1');
      expect(h1Wrap.text()).toBe(`cu_${$privName}`);
    };

    const View = ({ refCu }) => (
      <div>
        <h1 >{refCu.$privName}</h1>
      </div>
    );
    const CompFn = () => {
      const { refComputed } = useConcent({ module: 'test', setup });
      return <View refCu={refComputed} />;
    };
    const CompCls = register({ module: 'test', setup })(
      class extends React.Component {
        render() {
          const { refComputed } = this.ctx;
          return <View refCu={refComputed} />;
        }
      }
    );

    testH1Text(CompFn);
    testH1Text(CompCls);
  });
});
