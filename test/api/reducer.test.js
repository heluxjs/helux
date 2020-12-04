import { run, reducer, getState, configure, cst } from '../../src/index';
import { makeStoreConfig } from '../util';

const Foo = 'foo';
const models = makeStoreConfig(Foo);
run(models, { log: false });

describe('test top property reducer', () => {
  test('root reducer should include built-in keys', () => {
    expect(reducer[cst.MODULE_GLOBAL]).toBeTruthy();
    expect(reducer[cst.MODULE_DEFAULT]).toBeTruthy();
  });


  test('root reducer should include module methods that configured by run', () => {
    expect(reducer[Foo].changeName).toBeInstanceOf(Function);
    expect(reducer[Foo].setState).toBeInstanceOf(Function);
  });


  test('foo module reducer fns should have been tagged', () => {
    const fooReducer = models[Foo].reducer;
    expect(fooReducer.changeName.__fnName).toBe('changeName');
    expect(fooReducer.changeName.__stateModule).toBe(Foo);
    expect(fooReducer.changeName.__isAsync).toBe(false);
  });


  test('root reducer should include module methods that configured by configure', () => {
    const Bar = 'bar';
    configure(makeStoreConfig(Bar, false));
    expect(reducer[Bar].changeName).toBeInstanceOf(Function);
    expect(reducer[Bar].setState).toBeInstanceOf(Function);
  });


  test('root reducer should not include non-configured module methods', () => {
    expect(reducer['non-existed-module']).toBeFalsy();
  });


  test('root reducer methods should work', () => {
    reducer[Foo].changeName('newName');
    const fooState = getState(Foo);
    expect(fooState.name).toBe('newName');
  });
});
