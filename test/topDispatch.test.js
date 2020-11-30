import { run, dispatch, getState, ccContext } from '../src/index';
import { makeStoreConfig, extractMessage } from './util';

const Foo = 'foo';

describe('test top api dispatch', () => {
  const models = makeStoreConfig(Foo);
  let fooState;

  beforeAll(() => {
    run(models, { logError: false });
    fooState = getState(Foo);
  });


  test('dispatch undeclared module', async () => {
    const moduleCount = Object.keys(ccContext.moduleName2stateKeys).length;
    await dispatch(`xxx/changeName`, 'payload');
    const moduleCountAfterDispatch = Object.keys(ccContext.moduleName2stateKeys).length;
    expect(moduleCount).toBe(moduleCountAfterDispatch);
  });


  test('dispatch undeclared method', async () => {
    try{
      await dispatch(`${Foo}/notExist`, 'payload');
    }catch(err){
      expect(extractMessage(err)).toMatch(/(?=no reducer fn found)/);
    }
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
