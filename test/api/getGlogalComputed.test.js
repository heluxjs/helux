import { run, cst, getGlobalComputed, getComputed } from '../../src/index';
import { makeStoreConfig } from '../util';

const Foo = 'foo';

describe('test top api getComputed', async () => {
  const models = makeStoreConfig('foo');

  beforeAll(() => {
    run(models, { log: false });
  });

  
  test('getGlobalComputed should be a function', () => {
    expect(typeof getGlobalComputed === 'function').toBeTruthy();
  });


  test('getGlobalComputed and getComputed that pass global module should return the same object', () => {
    expect(getGlobalComputed() === getComputed(cst.MODULE_GLOBAL)).toBeTruthy();
  });
});
