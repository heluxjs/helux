/** @typedef {import('../../src/types-inner').IRefCtx} Ctx */
import { act } from 'react-dom/test-utils';
import '../testSetup';
import { run, useConcent, register, defWatch } from '../../src/index';
import { okeys } from '../../src/support/util';
import { getTestModels, mountCompThenAssertValue, makeComp } from '../util';


const models = getTestModels();
const warningList = [];
run(models, {
  log: false,
  act,
  warningHandler: (err) => {
    warningList.push(err);
  }
});

describe('test ctx api watch', () => {
  test('dup watch key should print warning', () => {
    const setup = (/** @type Ctx */ctx) => {
      ctx.initState({ localName: '' });
      ctx.watch('localName', (newState) => console.log(newState.localName));
      ctx.watch('localName', (newState) => console.log(newState.localName));
    };
    const { CompFn, CompCls } = makeComp('test', setup);
    mountCompThenAssertValue(CompFn);
    mountCompThenAssertValue(CompCls);
    expect(warningList[0].message).toMatch(/(?=duplicate in ref watch)/);
  });

  const triggerAssertionInWatchCb = (setup) => {
    const { CompFn, CompCls } = makeComp('test', setup);
    const clickAction = (wrap) => wrap.find('button').simulate('click');
    mountCompThenAssertValue(CompFn, [], { clickAction });
    mountCompThenAssertValue(CompCls, [], { clickAction });
  };

  test('define ref watch with (key, fn) for local state key', () => {
    const setup = (/** @type Ctx */ctx) => {
      ctx.initState({ localName: '', localAge: 1 });
      ctx.watch('localName', (newState) => {
        expect(newState.localName).toBe('hi');
      });
      ctx.watch('localAge', (newState) => {
        expect(newState.localAge).toBe(2);
      });
      return {
        onBtnClick: () => ctx.setState({ localName: 'hi', localAge: 2 }),
      };
    };
    triggerAssertionInWatchCb(setup);
  });

  test('define ref watch with (key, fnDesc) for local state key', () => {
    const setup = (/** @type Ctx */ctx) => {
      ctx.initState({ localName: '', localAge: 1 });
      ctx.watch('localName', {
        fn: (newState) => {
          expect(newState.localName).toBe('hi');
        },
      });
      ctx.watch('localAge', {
        fn: (newState) => {
          expect(newState.localAge).toBe(2);
        },
      });
      return {
        onBtnClick: () => ctx.setState({ localName: 'hi', localAge: 2 }),
      };
    };
    triggerAssertionInWatchCb(setup);
  });

  test('define ref watch with (key2FnMap) for local state key', () => {
    const setup = (/** @type Ctx */ctx) => {
      ctx.initState({ localName: '', localAge: 1 });
      ctx.watch({
        localName: (newState) => {
          expect(newState.localName).toBe('hi');
        },
        localAge: (newState) => {
          expect(newState.localAge).toBe(2);
        }
      });
      return {
        onBtnClick: () => ctx.setState({ localName: 'hi', localAge: 2 }),
      };
    };
    triggerAssertionInWatchCb(setup);
  });

  test('define ref watch with (key2FnDescMap) for local state key', () => {
    const setup = (/** @type Ctx */ctx) => {
      ctx.initState({ localName: '', localAge: 1 });
      ctx.watch({
        localName: {
          fn: (newState) => {
            expect(newState.localName).toBe('hi');
          },
        },
        localAge: {
          fn: (newState) => {
            expect(newState.localAge).toBe(2);
          },
        }
      });
      return {
        onBtnClick: () => ctx.setState({ localName: 'hi', localAge: 2 }),
      };
    };
    triggerAssertionInWatchCb(setup);
  });

  test('define ref watch with (key2defWatchMap) for local state key', () => {
    const setup = (/** @type Ctx */ctx) => {
      ctx.initState({ localName: '', localAge: 1 });
      ctx.watch({
        localName: defWatch((newState) => {
          expect(newState.localName).toBe('hi');
        }),
        localAge: defWatch((newState) => {
          expect(newState.localAge).toBe(2);
        }),
      });
      return {
        onBtnClick: () => ctx.setState({ localName: 'hi', localAge: 2 }),
      };
    };
    triggerAssertionInWatchCb(setup);
  });

  test('define ref watch with (key, defWatch) for local state key', () => {
    const setup = (/** @type Ctx */ctx) => {
      ctx.initState({ localName: '', localAge: 1 });
      ctx.watch('localNameChange', defWatch((newState) => {
        expect(newState.localName).toBe('hi');
      }));
      ctx.watch('localAgeChange', defWatch((newState) => {
        expect(newState.localAge).toBe(2);
      }));
      return {
        onBtnClick: () => ctx.setState({ localName: 'hi', localAge: 2 }),
      };
    };
    triggerAssertionInWatchCb(setup);
  });

  test('define ref watch in mixed mode for local state key', () => {
    const setup = (/** @type Ctx */ctx) => {
      ctx.initState({ localName: '', localAge: 1 });
      ctx.watch('localNameChange1', (newState) => {
        expect(newState.localName).toBe('hi');
      });
      ctx.watch('localNameChange2', {
        fn: (newState) => {
          expect(newState.localName).toBe('hi');
        },
      });
      ctx.watch('localNameChange3', defWatch((newState) => {
        expect(newState.localName).toBe('hi');
      }));
      return {
        onBtnClick: () => ctx.setState({ localName: 'hi', localAge: 2 }),
      };
    };
    triggerAssertionInWatchCb(setup);
  });

  /////////////////////////////////////////////////////////////////////////////////////////////
  // start test for module state
  /////////////////////////////////////////////////////////////////////////////////////////////

  test('define ref watch with (key, fn) for module state key', () => {
    const setup = (/** @type Ctx */ctx) => {
      ctx.initState({ name: '', age: 1 });
      ctx.watch('name', (newState) => {
        expect(newState.name).toBe('hi');
      });
      ctx.watch('age', (newState) => {
        expect(newState.age).toBe(2);
      });
      return {
        onBtnClick: () => ctx.setState({ name: 'hi', age: 2 }),
      };
    };
    triggerAssertionInWatchCb(setup);
  });

  test('define ref watch with (key, fnDesc) for module state key', () => {
    const setup = (/** @type Ctx */ctx) => {
      ctx.initState({ name: '', age: 1 });
      ctx.watch('name', {
        fn: (newState) => {
          expect(newState.name).toBe('hi');
        },
      });
      ctx.watch('age', {
        fn: (newState) => {
          expect(newState.age).toBe(2);
        },
      });
      return {
        onBtnClick: () => ctx.setState({ name: 'hi', age: 2 }),
      };
    };
    triggerAssertionInWatchCb(setup);
  });

  test('define ref watch with (key2FnMap) for module state key', () => {
    const setup = (/** @type Ctx */ctx) => {
      ctx.initState({ name: '', age: 1 });
      ctx.watch({
        name: (newState) => {
          expect(newState.name).toBe('hi');
        },
        age: (newState) => {
          expect(newState.age).toBe(2);
        }
      });
      return {
        onBtnClick: () => ctx.setState({ name: 'hi', age: 2 }),
      };
    };
    triggerAssertionInWatchCb(setup);
  });

  test('define ref watch with (key2FnDescMap) for module state key', () => {
    const setup = (/** @type Ctx */ctx) => {
      ctx.initState({ name: '', age: 1 });
      ctx.watch({
        name: {
          fn: (newState) => {
            expect(newState.name).toBe('hi');
          },
        },
        age: {
          fn: (newState) => {
            expect(newState.age).toBe(2);
          },
        }
      });
      return {
        onBtnClick: () => ctx.setState({ name: 'hi', age: 2 }),
      };
    };
    triggerAssertionInWatchCb(setup);
  });

  test('define ref watch with (key2defWatchMap) for module state key', () => {
    const setup = (/** @type Ctx */ctx) => {
      ctx.initState({ name: '', age: 1 });
      ctx.watch({
        name: defWatch((newState) => {
          expect(newState.name).toBe('hi');
        }),
        age: defWatch((newState) => {
          expect(newState.age).toBe(2);
        }),
      });
      return {
        onBtnClick: () => ctx.setState({ name: 'hi', age: 2 }),
      };
    };
    triggerAssertionInWatchCb(setup);
  });

  test('define ref watch with (key, defWatch) for module state key', () => {
    const setup = (/** @type Ctx */ctx) => {
      ctx.watch('name', defWatch((newState) => {
        expect(newState.name).toBe('hi');
      }));
      // when key is not a state key of module state, should set immediate immediate
      ctx.watch('ageChange', defWatch(({ age }, o, f) => {
        if (f.isFirstCall) return;
        expect(age).toBe(2);
      }, { immediate: true }));
      ctx.watch('age', defWatch((newState) => {
        expect(newState.age).toBe(2);
      }));
      return {
        onBtnClick: () => ctx.setState({ name: 'hi', age: 2 }),
      };
    };
    triggerAssertionInWatchCb(setup);
  });

  test('define ref watch in mixed mode for module state key', () => {
    const setup = (/** @type Ctx */ctx) => {
      ctx.initState({ name: '', age: 1 });
      ctx.watch('localNameChange1', ({ name }, o, f) => {
        if (f.isFirstCall) return;
        expect(name).toBe('hi');
      }, true, true);
      ctx.watch('localNameChange1', {
        fn: ({ name }, o, f) => {
          if (f.isFirstCall) return;
          expect(name).toBe('hi');
        },
        immediate: true
      });
      ctx.watch('localNameChange3', defWatch(({ name }, o, f) => {
        if (f.isFirstCall) return;
        expect(name).toBe('hi');
      }, { immediate: true }));
      return {
        onBtnClick: () => ctx.setState({ name: 'hi', age: 2 }),
      };
    };
    triggerAssertionInWatchCb(setup);
  });

});
