import { run, setState, getState } from '../../src/index';
import { makeStoreConfig, extractMessage } from '../util';

const Foo = 'foo';

describe('test top api setState', async () => {
  let fooState;

  beforeAll(() => {
    run(makeStoreConfig('foo'), { log: false });
    fooState = getState(Foo);
  });


  test('passing an undeclared module name is not allowed', ()=>{
    try {
      setState('undeclared module name', { bar: 222 });
    } catch (err) {
      expect(extractMessage(err)).toMatch(/(?=is not declared in store)/);
    }
  });


  test('passing an undeclared state key has no effect', () => {
    setState(Foo, { undeclaredKey: 222 });
    expect(fooState.undeclaredKey).toEqual(undefined);
    expect(Object.keys(fooState).length).toEqual(4);
  });


  test('passing an non plain json state has no effect', () => {
    setState(Foo, 2);
  });


  test('passing one state key has effect', () => {
    setState(Foo, { undeclaredKey: 222 });
    expect(fooState.undeclaredKey).toEqual(undefined);
    expect(Object.keys(fooState).length).toEqual(4);
  });


  test('passing one state key has effect', () => {
    setState(Foo, { name: 'gogo' });
    expect(fooState.name).toBe('gogo');
  });


  test('passing multi state keys has effect', () => {
    setState(Foo, { name: 'concent', age: 1 });
    expect(fooState.name).toBe('concent');
    expect(fooState.age).toBe(1);
  });
});
