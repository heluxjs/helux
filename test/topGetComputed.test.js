import { run, getComputed, getState } from '../src/index';
import { makeStoreConfig } from './util';

describe('test top api getComputed', async () => {
  const models = makeStoreConfig('foo');
  const fooModel = models.foo;

  beforeAll(() => {
    run(models, { logError: false });
  });

  
  test('getComputed should be a function', () => {
    expect(typeof getComputed === 'function').toBeTruthy();
  });


  test('getComputed should return existed module computed result', () => {
    const fooCu = getComputed('foo');
    const fooState = getState('foo');
    expect(typeof fooCu === 'object').toBeTruthy();

    const nameCu = fooModel.computed.name(fooState);
    expect(fooCu.name === nameCu).toBeTruthy();
  });


  test('getComputed should return undefined for non-existed module', () => {
    const cu = getComputed('foo-xxx');
    expect(!cu).toBeTruthy();
  });
});
