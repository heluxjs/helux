/** @typedef {import('../../src/types-inner').IRefCtx} Ctx */
import { act } from 'react-dom/test-utils';
import '../testSetup';
import { run } from '../../src/index';
import { getTestModels } from '../util';
import * as tcs from './_testChangeState'

const errorList = [];
const models = getTestModels();
run(models, {
  log: false, act, errorHandler: (err) => {
    errorList.push(err);
  }
});

const setState = models.test.reducer.setState;

const paramStyle1 = `[call with (type:string)]`;
const paramStyle2 = `[call with (type:Function)]`;
const paramStyle3 = `[call with (type:{type:string})]`;
const paramStyle4 = `[call with (type:{fn:Function})]`;
const paramStyle5 = `[call with (type:[module:string,fn:Function])]`;

describe('test ctx api dispatch', () => {
  test('[call with (type:{type:Fn})] should throw error', () => {
    tcs.testPassEmptyState((/** @type Ctx*/ctx) => () => ctx.dispatch({ type: setState }));
    expect(errorList[0].message).toMatch(/(?=dispatchDesc.type must be string)/);
  });
  test('[call with ()] should throw error', () => {
    tcs.testPassEmptyState((/** @type Ctx*/ctx) => () => ctx.dispatch());
    expect(errorList[1].message).toMatch(/(?=dispatchDesc.type must be string)/);
  });

  test(`${paramStyle1} pass empty state should do nothing`, () => {
    tcs.testPassEmptyState((/** @type Ctx*/ctx) => () => ctx.dispatch('setState'));
  });
  test(`${paramStyle2} pass empty state should do nothing`, () => {
    tcs.testPassEmptyState((/** @type Ctx*/ctx) => () => ctx.dispatch(setState));
  });
  test(`${paramStyle3} pass empty state should do nothing`, () => {
    tcs.testPassEmptyState((/** @type Ctx*/ctx) => () => ctx.dispatch({ type: 'setState' }));
  });
  test(`${paramStyle4} pass empty state should do nothing`, () => {
    tcs.testPassEmptyState((/** @type Ctx*/ctx) => () => ctx.dispatch({ fn: setState }));
  });
  test(`${paramStyle5} pass empty state should do nothing`, () => {
    tcs.testPassEmptyState((/** @type Ctx*/ctx) => () => ctx.dispatch([ctx.module, setState]));
  });


  test(`${paramStyle1} pass valid state should trigger comp-ins re-render`, () => {
    tcs.testPassInvalidState((/** @type Ctx*/ctx) => () => ctx.dispatch('setState', { name: Date.now() }));
  });
  test(`${paramStyle2} pass valid state should trigger comp-ins re-render`, () => {
    tcs.testPassInvalidState((/** @type Ctx*/ctx) => () => ctx.dispatch(setState, { name: Date.now() }));
  });
  test(`${paramStyle3} pass valid state should trigger comp-ins re-render`, () => {
    tcs.testPassInvalidState((/** @type Ctx*/ctx) => () => ctx.dispatch({ type: 'setState' }, { name: Date.now() }));
  });
  test(`${paramStyle4} pass valid state should trigger comp-ins re-render`, () => {
    tcs.testPassInvalidState((/** @type Ctx*/ctx) => () => ctx.dispatch({ fn: setState }, { name: Date.now() }));
  });
  test(`${paramStyle5} pass valid state should trigger comp-ins re-render`, () => {
    tcs.testPassInvalidState((/** @type Ctx*/ctx) => () => ctx.dispatch([ctx.module, setState], { name: Date.now() }));
  });


  test(`${paramStyle1} renderKey should work`, async () => {
    await tcs.testRenderKey((/** @type Ctx*/ctx, toUpdate, bookId) => () => {
      ctx.dispatch('setState', toUpdate, bookId);
    });
  });
  test(`${paramStyle2} renderKey should work`, async () => {
    await tcs.testRenderKey((/** @type Ctx*/ctx, toUpdate, bookId) => () => {
      ctx.dispatch(setState, toUpdate, bookId);
    });
  });
  test(`${paramStyle3} renderKey should work`, async () => {
    await tcs.testRenderKey((/** @type Ctx*/ctx, toUpdate, bookId) => () => {
      ctx.dispatch({ type: 'setState' }, toUpdate, bookId);
    });
  });
  test(`${paramStyle4} renderKey should work`, async () => {
    await tcs.testRenderKey((/** @type Ctx*/ctx, toUpdate, bookId) => () => {
      ctx.dispatch({ fn: setState }, toUpdate, bookId);
    });
  });
  test(`${paramStyle5} renderKey should work`, async () => {
    await tcs.testRenderKey((/** @type Ctx*/ctx, toUpdate, bookId) => () => {
      ctx.dispatch([ctx.module, setState], toUpdate, bookId);
    });
  });


  test(`${paramStyle1} renderKey and delay should work for item click`, async () => {
    await tcs.testDelayForItemClick((/** @type Ctx*/ctx, toUpdate, bookId) => () => {
      ctx.dispatch('setState', toUpdate, bookId, 500);
    });
  });
  test(`${paramStyle2} renderKey and delay should work for item click`, async () => {
    await tcs.testDelayForItemClick((/** @type Ctx*/ctx, toUpdate, bookId) => () => {
      ctx.dispatch(setState, toUpdate, bookId, 500);
    });
  });
  test(`${paramStyle3} renderKey and delay should work for item click`, async () => {
    await tcs.testDelayForItemClick((/** @type Ctx*/ctx, toUpdate, bookId) => () => {
      ctx.dispatch({ type: 'setState' }, toUpdate, bookId, 500);
    });
  });
  test(`${paramStyle4} renderKey and delay should work for item click`, async () => {
    await tcs.testDelayForItemClick((/** @type Ctx*/ctx, toUpdate, bookId) => () => {
      ctx.dispatch({ fn: setState }, toUpdate, bookId, 500);
    });
  });
  test(`${paramStyle5} renderKey and delay should work for item click`, async () => {
    await tcs.testDelayForItemClick((/** @type Ctx*/ctx, toUpdate, bookId) => () => {
      ctx.dispatch([ctx.module, setState], toUpdate, bookId, 500);
    });
  });


  test(`${paramStyle1} renderKey should work for container click`, async () => {
    await tcs.testRenderKeyForContainerClick((/** @type Ctx*/ctx, toUpdate, bookId) => () => {
      ctx.dispatch(setState, toUpdate, bookId);
    });
  });
  test(`${paramStyle2} renderKey should work for container click`, async () => {
    await tcs.testRenderKeyForContainerClick((/** @type Ctx*/ctx, toUpdate, bookId) => () => {
      ctx.dispatch(setState, toUpdate, bookId);
    });
  });
  test(`${paramStyle3} renderKey should work for container click`, async () => {
    await tcs.testRenderKeyForContainerClick((/** @type Ctx*/ctx, toUpdate, bookId) => () => {
      ctx.dispatch({ type: 'setState' }, toUpdate, bookId);
    });
  });
  test(`${paramStyle4} renderKey should work for container click`, async () => {
    await tcs.testRenderKeyForContainerClick((/** @type Ctx*/ctx, toUpdate, bookId) => () => {
      ctx.dispatch({ fn: setState }, toUpdate, bookId);
    });
  });
  test(`${paramStyle5} renderKey should work for container click`, async () => {
    await tcs.testRenderKeyForContainerClick((/** @type Ctx*/ctx, toUpdate, bookId) => () => {
      ctx.dispatch([ctx.module, setState], toUpdate, bookId);
    });
  });
});
