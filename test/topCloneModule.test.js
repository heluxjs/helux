import { run, cloneModule, getState, getComputed, reducer, dispatch } from '../src/index';
import { makeStoreConfig } from './util';

const Foo = 'foo';
const Bar = 'bar';
const Baz = 'baz';

describe('test top api cloneModule', () => {
  const models = makeStoreConfig(Foo);

  beforeAll(() => {
    run(models, { logError: false });
  });

  test('clone non-existing source module is not allowed', () => {
    try {
      cloneModule(Bar, 'anUnexistedModule')
    } catch (err) {
      expect(err.message).toMatch(/(?=module not found)/);
    }
  });

  test('clone a source module with non fn delaration state is not allowed', () => {
    try {
      cloneModule(Bar, 'withNormalStateDeclaration')
    } catch (err) {
      expect(err.message).toMatch(/(?=state must be a function when use cloneModule)/);
    }
  });

  test('should clone source module all properties', () => {
    let barState = getState(Bar);
    let barCu = getComputed(Bar);
    expect(barState === undefined).toBeTruthy();
    expect(barCu === undefined).toBeTruthy();
    expect(reducer[Bar] === undefined).toBeTruthy();
    // generate bar module by cloning from foo module
    cloneModule(Bar, Foo);

    barState = getState(Bar);
    barCu = getComputed(Bar);
    const fooState = getState(Foo);
    const fooCu = getComputed(Foo);

    Object.keys(fooState).forEach(stateKey => {
      expect(barState[stateKey] !== undefined).toBeTruthy();
    });
    Object.keys(reducer[Foo]).forEach(fnKey => {
      expect(reducer[Bar][fnKey] !== undefined).toBeTruthy();
    });
    Object.keys(fooCu).forEach(stateKey => {
      expect(barCu[stateKey] !== undefined).toBeTruthy();
    });
  });

  test('operate cloned module should have no effect on source module', async () => {
    cloneModule(Baz, Foo);

    const bazState = getState(Baz);
    const bazCu = getComputed(Baz);
    const fooState = getState(Foo);
    const fooCu = getComputed(Foo);

    await reducer[Baz].changeName('newNameForBaz');
    expect(bazState.name === 'newNameForBaz').toBeTruthy();
    expect(bazCu.name === 'name_newNameForBaz').toBeTruthy();
    expect(fooState.name !== 'newNameForBaz').toBeTruthy();
    expect(fooCu.name !== 'name_newNameForBaz').toBeTruthy();
  });
});
