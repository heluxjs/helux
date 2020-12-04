import '../testSetup';
import React from 'react';
import { mount } from 'enzyme';
import { run, getState, useConcent } from '../../src/index';
import { getTestModels, mountCompThenAssertH2Value as mountCompThenAssertValue, makeComp } from '../util';

const models = getTestModels();
const errList = [];

run(models, {
  logError: false,
  isStrict: true,
  errorHandler: (err) => {
    errList.push(err);
  },
});


describe('test ctx api computed', () => {
  test('computed should only been called in setup block', () => {
    const CompFn = () => {
      const { computed, refComputed: rcu } = useConcent({ state: { num: 1 } });
      computed('doubleNum', ({ num }) => num * 2);
      return <h1>{rcu.doubleNum}</h1>
    };
    const warp = mount(<CompFn />);
    expect(warp.find('h1').text()).toBeFalsy();
    expect(errList[0].message).toMatch(/(?=ref computed must been called in setup block)/);
  });

  const testlogic1 = (setup) => {
    const { CompFn, CompCls } = makeComp('test', setup);
    const compareItems = [
      { key: 'prefixedName', compareValue: `hi_${getState('test').name}`, eq: true },
    ];
    mountCompThenAssertValue(CompFn, compareItems);
    mountCompThenAssertValue(CompCls, compareItems);
  }
  test('define ref computed with (cuKey, fn), take module state as input', () => {
    const setup = (ctx) => {
      ctx.computed('prefixedName', ({ name }) => {
        return `hi_${name}`;
      });
    }
    testlogic1(setup);
  });
  test('define ref computed with (cuKey, fnDesc), take module state as input', () => {
    const setup = (ctx) => {
      ctx.computed('prefixedName', {
        fn: ({ name }) => `hi_${name}`,
      });
    }
    testlogic1(setup);
  });
  test('define ref computed with (cuDesc), take module state as input', () => {
    const setup = (ctx) => {
      ctx.computed({
        prefixedName: ({ name }) => `hi_${name}`,
      });
    }
    testlogic1(setup);
  });
  test('define ref computed with (cuDesc) include fnDesc, take module state as input', () => {
    const setup = (ctx) => {
      ctx.computed({
        prefixedName: {
          fn: ({ name }) => `hi_${name}`,
        },
      });
    }
    testlogic1(setup);
  });


  const testlogic2 = (setup) => {
    const { CompFn, CompCls } = makeComp('test', setup);
    const compareItems = [
      { key: 'prefixedName', compareValue: `hi_privName`, eq: true },
    ];
    mountCompThenAssertValue(CompFn, compareItems);
    mountCompThenAssertValue(CompCls, compareItems);
  }
  test('define ref computed with (cuKey, fn), take private state as input', () => {
    const setup = (ctx) => {
      ctx.initState({ privName: 'privName' });
      ctx.computed('prefixedName', ({ privName }) => {
        return `hi_${privName}`;
      });
    }
    testlogic2(setup);
  });
  test('define ref computed with (cuKey, fnDesc), take private state as input', () => {
    const setup = (ctx) => {
      ctx.initState({ privName: 'privName' });
      ctx.computed('prefixedName', {
        fn: ({ privName }) => `hi_${privName}`,
      });
    }
    testlogic2(setup);
  });
  test('define ref computed with (cuDesc), take private state as input', () => {
    const setup = (ctx) => {
      ctx.initState({ privName: 'privName' });
      ctx.computed({
        'prefixedName': ({ privName }) => `hi_${privName}`,
      });
    }
    testlogic2(setup);
  });


  const testlogic3 = (setup) => {
    const { CompFn, CompCls } = makeComp('test', setup);
    const compareItems = [
      { key: 'prefixedPrivName', compareValue: `hi_priv_privName`, eq: true },
      { key: 'prefixedModuleName', compareValue: `hi_module_${getState('test').name}`, eq: true },
    ];
    mountCompThenAssertValue(CompFn, compareItems);
    mountCompThenAssertValue(CompCls, compareItems);
  }
  test('define ref computed with (cuKey, fn), take module state and private state as input both', () => {
    const setup = (ctx) => {
      ctx.initState({ privName: 'privName' });
      ctx.computed('prefixedPrivName', ({ privName }) => `hi_priv_${privName}`);
      ctx.computed('prefixedModuleName', ({ name }) => `hi_module_${name}`);
    };
    testlogic3(setup);
  });
  test('define ref computed with (cuKey, fnDesc), take module state and private state as input both', () => {
    const setup = (ctx) => {
      ctx.initState({ privName: 'privName' });
      ctx.computed('prefixedPrivName', {
        fn: ({ privName }) => `hi_priv_${privName}`,
      });
      ctx.computed('prefixedModuleName', {
        fn: ({ name }) => `hi_module_${name}`,
      });
    };
    testlogic3(setup);
  });
  test('define ref computed with (cuDesc), take module state and private state as input both', () => {
    const setup = (ctx) => {
      ctx.initState({ privName: 'privName' });
      ctx.computed({
        prefixedPrivName: ({ privName }) => `hi_priv_${privName}`,
        prefixedModuleName: ({ name }) => `hi_module_${name}`,
      });
    };
    testlogic3(setup);
  });


  test('(cuDesc)、(cuKey, fn) and (cuKey, fnDesc) can be called together', () => {
    const setup = (ctx) => {
      ctx.initState({ privName: 'privName' });
      ctx.computed({
        prefixedPrivName: ({ privName }) => `hi_priv_${privName}`,
        prefixedModuleName: ({ name }) => `hi_module_${name}`,
        taggedModuleName: {
          fn: ({ name }) => `tagged_${name}`,
        },
      });
      ctx.computed('doubleAge', ({ age }) => age * 2);
      ctx.computed('x4Age', {
        fn: ({ age }) => age * 4,
      });
    };

    const { CompFn, CompCls } = makeComp('test', setup);
    const compareItems = [
      { key: 'prefixedPrivName', compareValue: `hi_priv_privName`, eq: true },
      { key: 'prefixedModuleName', compareValue: `hi_module_${getState('test').name}`, eq: true },
      { key: 'taggedModuleName', compareValue: `tagged_${getState('test').name}`, eq: true },
      { key: 'doubleAge', compareValue: getState('test').age * 2, eq: true, valueType: 'number' },
      { key: 'x4Age', compareValue: getState('test').age * 4, eq: true, valueType: 'number' },
    ];
    mountCompThenAssertValue(CompFn, compareItems);
    mountCompThenAssertValue(CompCls, compareItems);
  });
});
