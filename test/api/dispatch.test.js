import { run, dispatch, getState, ccContext } from '../../src/index';
import { makeStoreConfig, extractMessage } from '../util';

const Foo = 'foo';
const errorList = [];

describe('test top api dispatch', () => {
  const models = makeStoreConfig(Foo);
  let fooState;

  beforeAll(() => {
    run(models, { log: false, errorHandler: err => errorList.push(err) });
    fooState = getState(Foo);
  });


  test('dispatch undeclared module do nothing', async () => {
    const moduleCount = Object.keys(ccContext.moduleName2stateKeys).length;
    await dispatch(`xxx/changeName`, 'payload');
    const moduleCountAfterDispatch = Object.keys(ccContext.moduleName2stateKeys).length;
    expect(moduleCount).toBe(moduleCountAfterDispatch);
  });


  test('dispatch undeclared method do nothing in unstrict mode', async () => {
    await dispatch(`${Foo}/notExist`, 'payload');
  });


  test('dispatch undeclared method should throw error in strict mode', async () => {
    ccContext.runtimeVar.isStrict = true; // hack
    await dispatch(`${Foo}/notExist`, 'payload');
    expect(errorList[0].message).toMatch(/(?=no reducer fn found)/);
    ccContext.runtimeVar.isStrict = false;
  });


  test('dispatch string leterial', async () => {
    await dispatch(`${Foo}/changeName`, 'payload');
    expect(fooState.name).toBe('payload');
  });

  
  test('dispatch reducer fn directly ', async () => {
    await dispatch(models[Foo].reducer.changeName, 'payload2');
    expect(fooState.name).toBe('payload2');
  });
});
