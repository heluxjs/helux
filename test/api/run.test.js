import { run, configure, ccContext, setState, getState, getComputed, clearContextIfHot, reducer } from '../../src/index';
import { makeStoreConfig } from '../util';

describe('test top api run', () => {
  beforeEach(() => {
    // let run can work for all test block
    ccContext.runtimeVar.logError = false;
    ccContext.isHot = true;
    clearContextIfHot();
    ccContext.info.latestStartupTime = 0;
    ccContext.info.firstStartupTime = 0;
    window.name = 'previewFrame';
  });

  
  test('check ccContext default params', () => {
    expect(ccContext.runtimeVar.computedCompare === false).toBeTruthy();
  })

  
  test('calling run api twice should throw error', () => {
    try {
      run(makeStoreConfig('foo'));
      run(makeStoreConfig('bar'));
    } catch (err) {
      expect(err.message).toMatch(/(?=run can only been called one time)/);
    }
  });


  test('passing models should work', () => {
    run(makeStoreConfig('foo'));
    expect(ccContext.isStartup).toBeTruthy();
  });


  test('calling run frist then configure should work', () => {
    run(makeStoreConfig('foo2', false));
    configure(makeStoreConfig('bar2', false))
  });


  test('calling configure frist then run should work', () => {
    configure(makeStoreConfig('bar3', false))
    run(makeStoreConfig('foo3', false));
  });


  test('testing setState behavior when runOptins.computedCompare is true', () => {
    run(makeStoreConfig('foo4', false), { computedCompare: true });
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
    run(makeStoreConfig('foo5', false), { computedCompare: false });
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
    });
    expect(reducer['test'].setState).toBeInstanceOf(Function);
  });
});
