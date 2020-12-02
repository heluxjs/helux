import { run, set, getState } from '../../src/index';
import { makeStoreConfig, extractMessage } from '../util';

const Foo = 'foo';

describe('test top api set', () => {
  const models = makeStoreConfig(Foo);
  let fooState;

  beforeAll(() => {
    run(models, { logError: false });
    fooState = getState(Foo);
  });


  test('set should be a function', () => {
    expect(set).toBeInstanceOf(Function);
  });


  test('setting undeclared module should throw error', () => {
    try {
      set(`notExistModule/age`, 'aKey');
    } catch (err) {
      expect(extractMessage(err)).toMatch(/(?=module not found)/);
    }
  });


  test('setting undeclared key should throw error', () => {
    try {
      set(`${Foo}/notExistKey`, 'aKey');
    } catch (err) {
      expect(extractMessage(err)).toMatch(/(?=no reducer fn found)/);
    }
  });


  test('setting a module key should work', () => {
    set(`${Foo}/age`, 19);
    expect(fooState.age).toBe(19);
  });


  test('setting a module key with dot should work', () => {
    set(`${Foo}/info.addr`, 'bj');
    expect(fooState.info.addr).toBe('bj');
  });


  test('setting a module key with dot should have no effect on other key', () => {
    const email = fooState.info.email;
    set(`${Foo}/info.addr`, 'new-york');
    expect(fooState.info.addr).toBe('new-york');
    expect(fooState.info.email).toBe(email);
  });


  test('setting a module key with delay param should work', async () => {
    set(`${Foo}/age`, 19, { delay: 3000 });
    expect(fooState.age === 19).toBeTruthy();
  });
});
