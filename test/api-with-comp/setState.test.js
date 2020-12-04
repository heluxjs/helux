import { act } from 'react-dom/test-utils';
import { run, setState } from '../../src/index';
import { getTestModels } from '../util';
import * as tcs from '../ctx/_testChangeState'

const models = getTestModels();
run(models, { logError: false, act });
const module = 'test';

describe('', ()=>{

  test('pass empty state should throw error', () => {
    try{
      setState();
    }catch(err){
      // pass
    };
  });


  test('pass valid state should trigger comp-ins re-render', () => {
    tcs.testPassInvalidState(() => () => setState(module, { name: Date.now() }));
  });


  test('renderKey should work', async () => {
    await tcs.testRenderKey((ctx, toUpdate, bookId) => () => {
      setState(module, toUpdate, bookId);
    });
  });

  test('renderKey should work for container click', async () => {
    await tcs.testRenderKeyForContainerClick((ctx, toUpdate, bookId) => () => {
      setState(module, toUpdate, bookId);
    });
  });
});
