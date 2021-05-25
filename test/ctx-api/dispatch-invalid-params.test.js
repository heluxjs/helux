/** @typedef {import('../../src/types-inner').IRefCtx} Ctx */
import { act } from 'react-dom/test-utils';
import '../testSetup';
import { run } from '../../src/index';
import { getTestModels } from '../util';
import * as tcs from './_testChangeState'

const models = getTestModels();
run(models, {
  log: false, act,
});

const setState = models.test.reducer.setState;

/**
 * 这两组测试用户放 dispatch.test.js里会干扰其里面其他测试用例的测试结果，故单独放此文件里
 */
describe('test ctx api dispatch invalid params', () => {
  test('[call with (type:{type:Fn})] should throw error', () => {
    tcs.testPassEmptyState((/** @type Ctx*/ctx) => async () => {
      try {
        await ctx.dispatch({ type: setState })
      } catch (err) {
        expect(err.message).toMatch(/(?=dispatchDesc.type must be string)/);
      }
    });
  });

  test('[call with ()] should throw error', () => {
    tcs.testPassEmptyState((/** @type Ctx*/ctx) => async () => {
      try {
        await ctx.dispatch();
      } catch (err) {
        expect(err.message).toMatch(/(?=dispatch param is null)/);
      }
    });
  });
});
