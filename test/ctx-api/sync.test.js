/** @typedef {import('../../src/types-inner').IRefCtx} Ctx */
import { act } from 'react-dom/test-utils';
import '../testSetup';
import { run, getState } from '../../src/index';
import { getTestModels } from '../util';
import * as tcs from './_testChangeState'

const models = getTestModels();
run(models, { log: false, act });

describe('test ctx api sync', () => {
  test('pass valid state should trigger comp-ins re-render', () => {
    tcs.testPassInvalidState((/** @type Ctx*/ctx) => ctx.sync('name', Date.now()));
  });


  test('renderKey should work', async () => {
    await tcs.testRenderKey((ctx, toUpdate, bookId) => ctx.sync('books', toUpdate.books, bookId));
  });


  test('renderKey and delay should work for item click', async () => {
    await tcs.testDelayForItemClick((ctx, toUpdate, bookId) => ctx.sync('books', toUpdate.books, bookId, 500));
  });
  

  test('renderKey should work for container click', async () => {
    await tcs.testRenderKeyForContainerClick((ctx, toUpdate, bookId) => ctx.sync('books', toUpdate.books, bookId));
  });
  

  test('syncBool should work', async () => {
    await tcs.testSyncApi((/** @type Ctx*/ctx) => ctx.syncBool('isBig'), '.isBig');
  });
  

  test('syncBool should not work if pass non-bool value', async () => {
    await tcs.testSyncApi((/** @type Ctx*/ctx) => ctx.syncBool('isBig2', 'not bool'), '.isBig2', () => {
      // still true
      expect(getState('test').isBig2 === true).toBeTruthy();
    });
  });
  
  
  // test('syncBool should not work if pass non-bool value for nest path', async () => {
  //   await tcs.testSyncApi((/** @type Ctx*/ctx) => ctx.syncBool('nestArr.1'), '.nestArr_1', () => {
  //     // still xxx
  //     expect(getState('test').nestArr[1] === 'xxx').toBeTruthy();
  //   });
  // });


  test('syncBool should work if original value in not bool type', async () => {
    await tcs.testSyncApi((/** @type Ctx*/ctx) => ctx.syncBool('isBig3'), '.isBig3', () => {
      expect(getState('test').isBig3 === false).toBeTruthy();
    });
  });
  

  test('nest obj syncBool should work', async () => {
    await tcs.testSyncApi((/** @type Ctx*/ctx) => ctx.syncBool('nest.isBig'), '.nest_isBig');
  });


  test('nest arr syncBool should work', async () => {
    await tcs.testSyncApi((/** @type Ctx*/ctx) => ctx.syncBool('nestArr.0'), '.nestArr_0');
  });

  
  test('nest obj arr syncBool should work', async () => {
    await tcs.testSyncApi((/** @type Ctx*/ctx) => ctx.syncBool('nestObjArr.0.isBig'), '.nestObjArr_0_isBig');
  });


  test('syncInt should work', async () => {
    await tcs.testSyncApi((/** @type Ctx*/ctx) => ctx.syncInt('grade', '20'), '.grade', () => {
      // should be number
      expect(getState('test').grade === 20).toBeTruthy();
    });
  });


  test('syncInt with NAN', async () => {
    await tcs.testSyncApi((/** @type Ctx*/ctx) => ctx.syncInt('grade2', 'convert to number'), '.grade2', () => {
      // convert fail
      expect(getState('test').grade2 === 'convert to number').toBeTruthy();
    });
  });


  test('syncAs should work', async () => {
    await tcs.testSyncApi((/** @type Ctx*/ctx) => ctx.syncAs('asValue', 'xxxx'), '.asValue', () => {
      expect(getState('test').asValue === 'xxxx').toBeTruthy();
    });
  });
});
