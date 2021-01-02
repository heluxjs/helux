import { run, cst, getGlobalState, getState } from '../../src/index';
import { makeStoreConfig } from '../util';

describe('test top api getComputed', async () => {
  const models = makeStoreConfig('foo');

  beforeAll(() => {
    run(models, { log: false });
  });

  
  test('getGlobalState should be a function', () => {
    expect(typeof getGlobalState === 'function').toBeTruthy();
  });


  test('getGlobalState and getState that pass global module should return the same object', () => {
    expect(getGlobalState() === getState(cst.MODULE_GLOBAL)).toBeTruthy();
  });
});
