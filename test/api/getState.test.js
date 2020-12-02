import { run, cst, getState } from '../../src/index';
import { makeStoreConfig } from '../util';

const Foo = 'foo';

describe('test top api getState', async () => {
  beforeAll(() => {
    run(makeStoreConfig('foo'), { logError: false });
  });

  
  test('a configured module should exists', () => {
    const fooState = getState(Foo);
    expect(fooState).toBeTruthy();
  });


  test('a non-configured module should not exist', () => {
    const state = getState('aNonConfiguredModule');
    expect(state).toBeFalsy();
  });


  test('passing no params should return root state', () => {
    const rootState = getState();
    expect(rootState[cst.MODULE_GLOBAL]).toBeTruthy();
    expect(rootState[cst.MODULE_DEFAULT]).toBeTruthy();
    expect(rootState[cst.MODULE_CC]).toBeTruthy();
    expect(rootState[Foo]).toBeTruthy();
  });
});
