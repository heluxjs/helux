/** @typedef {import('../../src/types-inner').IRefCtx} Ctx */
import { act } from 'react-dom/test-utils';
import '../testSetup';
import { run } from '../../src/index';
import { getTestModels } from '../util';
import * as tcs from './_testChangeState'

const models = getTestModels();
run(models, { logError: false, act });

describe('test ctx api setModuleState', () => {
  test('pass empty state should do nothing', () => {
    tcs.testPassEmptyState((/** @type Ctx*/ctx) => () => ctx.setModuleState());
  });


  test('pass valid state should trigger comp-ins re-render', () => {
    tcs.testPassInvalidState((/** @type Ctx*/ctx) => () => ctx.setModuleState(ctx.module, { name: Date.now() }));
  });


  test('pass state and cb, cb should be called, cb state param should be updated', () => {
    tcs.testPassInvalidStateAndCb((/** @type Ctx*/ctx) => () => {
      const name = Date.now();
      ctx.setModuleState(ctx.module, { name }, (state) => {
        expect(name).toBe(state.name);
        ctx.setModuleState(ctx.module, { age: 22 });
      });
    });
  });


  test('renderKey should work', async () => {
    await tcs.testRenderKey((/** @type Ctx*/ctx, toUpdate, bookId) => () => {
      ctx.setModuleState(ctx.module, toUpdate, null, bookId);
    });
  });


  test('renderKey and delay should work for item click', async () => {
    await tcs.testDelayForItemClick((/** @type Ctx*/ctx, toUpdate, bookId) => () => {
      ctx.setModuleState(ctx.module, toUpdate, null, bookId, 500);
    });
  });


  test('renderKey should work for container click', async () => {
    await tcs.testRenderKeyForContainerClick((/** @type Ctx*/ctx, toUpdate, bookId) => () => {
      ctx.setModuleState(ctx.module, toUpdate, null, bookId);
    });
  });
});
