/** @typedef {import('../../src/types-inner').IRefCtx} Ctx */
import { act } from 'react-dom/test-utils';
import '../testSetup';
import { run } from '../../src/index';
import { getTestModels } from '../util';
import * as tcs from './_testChangeState'

const models = getTestModels();
run(models, { log: false, act });

function custSetState(toUpdate) {
  return toUpdate;
}

describe('test ctx api invoke', () => {
  test('pass empty state should do nothing', () => {
    tcs.testPassEmptyState((/** @type Ctx*/ctx) => () => ctx.invoke(custSetState));
  });


  test('pass valid state should trigger comp-ins re-render', () => {
    tcs.testPassInvalidState((/** @type Ctx*/ctx) => () => ctx.invoke(custSetState, { name: Date.now() }));
  });


  test('renderKey should work', async () => {
    await tcs.testRenderKey((/** @type Ctx*/ctx, toUpdate, bookId) => () => {
      ctx.invoke(custSetState, toUpdate, bookId);
    });
  });


  test('renderKey and delay should work for item click', async () => {
    await tcs.testDelayForItemClick((/** @type Ctx*/ctx, toUpdate, bookId) => () => {
      ctx.invoke(custSetState, toUpdate, bookId, 500);
    });
  });


  test('renderKey should work for container click', async () => {
    await tcs.testRenderKeyForContainerClick((/** @type Ctx*/ctx, toUpdate, bookId) => () => {
      ctx.invoke(custSetState, toUpdate, bookId);
    });
  });
});
