import {
  run, configure, ccContext, setState, getState, getComputed,
  clearContextIfHot, reducer, cst,
} from '../../src/index';
import { makeStoreConfig, delay } from '../util';

const errorList = [];

describe('test top api run', () => {
  beforeEach(() => {
    // let run can work for all test block
    ccContext.runtimeVar.log = false;
    ccContext.isHot = true;
    ccContext.runtimeHandler.errorHandler = null;
    clearContextIfHot();
    ccContext.info.latestStartupTime = 0;
    ccContext.info.firstStartupTime = 0;
    window.name = 'previewFrame';
  });


  test('check ccContext default params', () => {
    expect(ccContext.runtimeVar.computedCompare === false).toBeTruthy();
  });


  test('configure plugin', () => {
    const aPlugin = {
      install: (on) => {
        on(cst.SIG_FN_START, ({ sig, payload }) => {
          expect(payload.calledBy !== undefined).toBeTruthy();
          expect(payload.module !== undefined).toBeTruthy();
        });
        return { name: 'a-plugin' };
      }
    };
    run({}, { plugins: [aPlugin] });
  });


  test('configure cc-like module should throw error', () => {
    try {
      run({ $$ccHi: { state: {} } }, { log: false });
    } catch (err) {
      expect(err.message).toMatch(/(?=a built-in module name)/);
    }
  });


  test('configure null module name should throw error', () => {
    try {
      run({ '': { state: {} } }, { log: false });
    } catch (err) {
      expect(err.message).toMatch(/(?=writing is invalid)/);
    }
  });


  test('configure non plain json module state should throw error', () => {
    try {
      run({ test: { state: 2 } }, { log: false });
    } catch (err) {
      expect(err.message).toMatch(/(?=is not a plain json object)/);
    }
  });


  test('calling run api twice should throw error', () => {
    try {
      run(makeStoreConfig('foo'), { log: false });
      run(makeStoreConfig('bar'), { log: false });
    } catch (err) {
      expect(err.message).toMatch(/(?=run can only been called one time)/);
    }
  });


  test('configure middleares should work', () => {
    let mid1HitCount = 0;
    let mid2HitCount = 0;
    run(makeStoreConfig('foo'), {
      log: false, middlewares: [
        (info, next) => {
          mid1HitCount += 1;
          next();
        },
        (info, next) => {
          mid2HitCount += 1;
          next();
        },
        (info, next) => {
          info.modState('tag', 'dangerously modTagInMiddleware');
          next();
        },
        5, // this item is not a function , so it will be ignored
      ]
    });
    setState('foo', { age: 19 });
    expect(mid1HitCount).toBe(1);
    expect(mid2HitCount).toBe(1);

    setState('foo', { age: 19 }, '', -1, true);
    // mid1HitCount is still 1 cause skipMiddleware arg is true
    expect(mid1HitCount === 1).toBeTruthy();
    expect(mid2HitCount === 1).toBeTruthy();

    expect(getState('foo').tag === 'dangerously modTagInMiddleware').toBeTruthy();
  });


  test('passing models should work', () => {
    run(makeStoreConfig('foo'), { log: false });
    expect(ccContext.isStartup).toBeTruthy();
  });


  test('calling run frist then configure should work', () => {
    run(makeStoreConfig('foo2', false), { log: false });
    configure(makeStoreConfig('bar2', false))
  });


  test('calling configure frist then run should work', () => {
    configure(makeStoreConfig('bar3', false))
    run(makeStoreConfig('foo3', false), { log: false });
  });


  test('testing setState behavior when runOptins.computedCompare is true', () => {
    run(makeStoreConfig('foo4', false), { log:false, computedCompare: true });
    const { info } = getState('foo4');
    const { info: infoCuBefore } = getComputed('foo4');

    // change original info ref's value
    info.addr = 'npm';
    setState('foo4', { info });
    const { info: infoAfter } = getComputed('foo4');
    // when runOptins.computedCompare is true, info cu will not been triggered
    // cause the info ref is always the same one
    expect(infoCuBefore === infoAfter).toBeTruthy();

    const infoCp = { ...info };
    info.addr = 'npm_new';
    setState('foo4', { info: infoCp });
    const { info: infoAfter2 } = getComputed('foo4');
    // info's value is a new ref, info cu will been triggered
    expect(infoCuBefore !== infoAfter2).toBeTruthy();
  });


  test('testing setState behavior when runOptins.computedCompare is false', () => {
    run(makeStoreConfig('foo5', false), { log:false, computedCompare: false });
    const { info } = getState('foo5');
    const { info: infoCuBefore } = getComputed('foo5');

    // change original info ref's value
    info.addr = 'npm';
    setState('foo5', { info });
    const { info: infoAfter } = getComputed('foo5');
    // when runOptins.computedCompare is false, info cu will been triggered
    // cause the key info is hited
    expect(infoCuBefore !== infoAfter).toBeTruthy();
  });

  
  test('setState should been injected to reducer fns automatically after run', () => {
    run({
      test: {
        state: { num: 1 },
      },
    }, { log: false });
    expect(reducer['test'].setState).toBeInstanceOf(Function);
  });


  test('lifecycle.initState should work', () => {
    run({
      test: {
        state: { num: 1, numBig: 100 },
        lifecycle: {
          initState(state) {
            expect(state.num).toBe(1);
            expect(state.numBig).toBe(100);
            return { num: 2, numBig: 200 };
          },
          initStateDone(dispatch, state) {
            expect(state.num).toBe(2);
            expect(state.numBig).toBe(200);
          },
        },
      },
    }, { log: false });
  });
  

  test('async lifecycle.initState should work', () => {
    run({
      test: {
        state: { num: 1, numBig: 100 },
        lifecycle: {
          async initState(state) {
            expect(state.num).toBe(1);
            expect(state.numBig).toBe(100);
            return { num: 2, numBig: 200 };
          },
          initStateDone(dispatch, state) {
            expect(state.num).toBe(2);
            expect(state.numBig).toBe(200);
          },
        },
      },
    }, { log: false });
  });
  

  test('initStateDone param dispatch should work', async () => {
    const models = {
      tmpModule: {
        state: { num: 1, numBig: 100 },
        reducer: {
          changeNum(num) {
            return { num };
          },
        },
        lifecycle: {
          async initState(state) {
            return { num: 2, numBig: 200 };
          },
          async initStateDone(dispatch, state) {
            await dispatch('changeNum', 300); // dispatch string leterial
            expect(getState('tmpModule').num).toBe(300);

            await dispatch(models.tmpModule.reducer.changeNum, 3000); // dispatch reducer fn
            expect(getState('tmpModule').num).toBe(3000);
          },
        },
      },
    };
    run(models, { log: false });
    await delay(2000);
  });
    

  test('initStateDone should been called even no initState defined', () => {
    let called = false;
    const models = {
      test2: {
        state: { num: 1, numBig: 100 },
        lifecycle: {
          initStateDone(dispatch, state) {
            expect(state.num).toBe(1);
            expect(state.numBig).toBe(100);
            called = true;
          },
        },
      },
    };
    run(models, { log: false });
    expect(called).toBe(true);
  });
      

  test('lifecycle.loaded called before lifecycle.initState', () => {
    let sig = 0;
    const models = {
      test3: {
        state: { num: 1, numBig: 100 },
        lifecycle: {
          loaded(){
            sig = 1;
          },
          initState(dispatch, state) {
            sig = 2;
          },
        },
      },
    };
    run(models, { log: false });
    expect(sig).toBe(1);
  });      


  test('call computed param fnCtx.commit multi times to change state should work', async () => {
    const models = {
      test4: {
        state: { num: 1, numBig: 2, age: 2 },
        computed: {
          numx2: ({ num }, o, f) => {
            f.commit({ numBig: 100 });
            f.commit({ age: 100 });
            return num * 2;
          }
        },
      },
    };
    run(models, { log: false });
    await delay(100);
    const { numBig, age } = getState('test4');
    expect(getComputed('test4').numx2).toBe(2);
    expect(numBig).toBe(100);
    expect(age).toBe(100);
  });


  test('call computed param fnCtx.commit one time to change state should work', () => {
    const models = {
      testFnCtx: {
        state: { num: 1, numBig: 2, age: 2 },
        computed: {
          numx2: ({ num }, o, f) => {
            f.commit({ numBig: 100, age: 100 });
            return num * 2;
          }
        },
      },
    };
    run(models, { log: false });
    const { numBig, age } = getState('testFnCtx');
    expect(numBig).toBe(100);
    expect(age).toBe(100);
  });


  test('forget call setInitialVal in async computed param should throw error', async () => {
    const models = {
      test6: {
        state: { num: 1, numBig: 2, age: 2 },
        computed: {
          numAsyncRet: async ({ num }, o, f) => {
            await delay(200);
            return 100;
          },
        },
      },
    };
    run(models, { log: false, asyncCuKeys: ['numAsyncRet'], errorHandler: err => errorList.push(err) });
    expect(errorList[0].message).toMatch(/(?=forget call setInitialVal)/);
  });


  test('async computed param', async () => {
    const models = {
      test5: {
        state: { num: 1, numBig: 2, age: 2 },
        computed: {
          numAsyncRet: async ({ num }, o, f) => {
            f.setInitialVal(num + 1);
            await delay(200);
            return 100;
          },
          num: () => 3,
        },
      },
    };
    run(models, { log: false, asyncCuKeys: ['numAsyncRet'] });
    expect(getComputed('test5').numAsyncRet).toBe(2);
    await delay(1500); // here must lte 1500
    expect(getComputed('test5').numAsyncRet).toBe(100);
  });
});
