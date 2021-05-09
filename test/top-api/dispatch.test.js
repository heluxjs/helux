import { run, dispatch, getState, ccContext } from '../../src/index';
import { makeStoreConfig } from '../util';

const Foo = 'foo';
const errorList = [];

describe('test top api dispatch', () => {
  const models = makeStoreConfig(Foo);
  let fooState;

  beforeAll(() => {
    run(models, { log: false, errorHandler: err => errorList.push(err) });
    fooState = getState(Foo);
  });


  test('dispatch undeclared module should throw error', async () => {
    const moduleCount = Object.keys(ccContext.moduleName2stateKeys).length;
    try{
      await dispatch(`xxx/changeName`, 'payload');
    }catch(err){
      expect(err.message).toMatch(/(?=not found)/);
    }
    const moduleCountAfterDispatch = Object.keys(ccContext.moduleName2stateKeys).length;
    expect(moduleCount).toBe(moduleCountAfterDispatch);
  });


  test('dispatch undeclared method do nothing when set unsafe_moveReducerErrToErrorHandler true', async () => {
    ccContext.runtimeVar.unsafe_moveReducerErrToErrorHandler = true; // hack
    await dispatch(`${Foo}/notExist`, 'payload');
  });


  test('dispatch undeclared method should throw error', async () => {
    ccContext.runtimeVar.unsafe_moveReducerErrToErrorHandler = false; // hack
    try {
      await dispatch(`${Foo}/notExist`, 'payload');
    } catch (err) {
      expect(err.message).toMatch(/(?=not found)/);
    }
  });


  test('dispatch string literal', async () => {
    await dispatch(`${Foo}/changeName`, 'payload');
    expect(fooState.name).toBe('payload');
  });

  
  test('dispatch reducer fn directly ', async () => {
    await dispatch(models[Foo].reducer.changeName, 'payload2');
    expect(fooState.name).toBe('payload2');
  });
});
