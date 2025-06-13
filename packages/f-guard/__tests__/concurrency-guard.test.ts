import { ConcurrencyGuard } from '../src';
import { DBWrap } from './mock-db';

const errorObj = new Error('error occurred');

function throwErrCb() {
  throw errorObj;
}

// 不使用内置的 Function，是为了方便 ReturnType 求值
type Func = (...args: any) => any;

function delay(ms = 1000) {
  return new Promise(r => setTimeout(r, ms));
}

// 模拟一个执行时间长达3s的函数，可配置前置运行逻辑，后置运行逻辑
async function longTimeFn<T extends Func>(beforeRunCb?: Func | null, afterRunCb?: T) {
  beforeRunCb?.();
  await delay(3000);
  return afterRunCb?.() as T extends Func ? ReturnType<T> : void;
}

// 创建一个模拟函数封装，返回 fn 函数，和记录 fn 运行情况的 runCtx 对象
function makeLongTimeFn<T extends Func>(beforeRunCb?: Func | null, afterRunCb?: T) {
  const runCtx = { runCount: 0 };
  return {
    /** 此函数执行需要3s */
    longTimeFn: () => longTimeFn<T>(() => {
      runCtx.runCount += 1;
      beforeRunCb?.();
    }, afterRunCb),
    runCtx,
  };
}

describe('ConcurrencyGuard', () => {
  test('call with no args', async () => {
    const guard = new ConcurrencyGuard();
    const result = await guard.call('key', () => Promise.resolve(1));
    expect(result).toBe(1);
  });

  test('call with args, return args', async () => {
    const guard = new ConcurrencyGuard();
    // 用函数参数列表约束动态参数类型
    const result = await guard.call('key', (p1: number, p2: number) => Promise.resolve([p1, p2]), 1, 2);
    expect(result).toMatchObject([1, 2]);
  });

  test('call with arg, return 1', async () => {
    const guard = new ConcurrencyGuard();
    // 用泛型约束动态参数类型
    const result = await guard.call<number, [number, number]>('key', () => Promise.resolve(1), 1, 2);
    expect(result).toBe(1);
  });

  test('apply', async () => {
    const guard = new ConcurrencyGuard();
    const result = await guard.apply('key', (p1: number, p2: number) => Promise.resolve([p1, p2]), [1, 2]);
    expect(result).toMatchObject([1, 2]);
  });

  test('apply with valid arg', async () => {
    const guard = new ConcurrencyGuard();
    // @ts-ignore 触发内部参数纠正逻辑
    const result = await guard.apply('key', p1 => Promise.resolve(p1), 1);
    expect(result).toBe(1);
  });

  /**
   * 未加 rpGettedMap 成员变量来控制是否调用 resultProm.reject(err) 时，此测试用例是失败的，溢出了未捕捉异常到运行时顶层
   */
  test('call fn with error one time', async () => {
    const { longTimeFn, runCtx } = makeLongTimeFn(null, throwErrCb);
    const guard = new ConcurrencyGuard();
    try {
      await guard.call('key', longTimeFn);
    } catch (err: any) {
      expect(runCtx.runCount).toBe(1);
      expect(err.message).toMatch(/(?=error occurred)/);
    }
  });

  test('concurrency call should receive all results', async () => {
    const { longTimeFn, runCtx } = makeLongTimeFn(null, () => 100);
    const guard = new ConcurrencyGuard();
    const tasks: any[] = [];
    for (let i = 0; i < 1000; i++) {
      // tasks.push(longTimeFn()); // 这样写将触发 longTimeFn 1000 次执行
      tasks.push(guard.call('key', longTimeFn)); // 仅一次执行
    }

    // 发起1000调用
    const results = await Promise.all(tasks);
    // 只触发一次执行
    expect(runCtx.runCount).toBe(1);
    expect(results.length).toBe(1000);
    // 抽样核对结果
    expect(results[1]).toBe(100);
    expect(results[500]).toBe(100);
    expect(results[999]).toBe(100);
  });

  test('concurrency call should catch all errors', async () => {
    const { longTimeFn, runCtx } = makeLongTimeFn(null, throwErrCb);
    const guard = new ConcurrencyGuard();
    const tasks: any[] = [];
    for (let i = 0; i < 1000; i++) {
      // tasks.push(longTimeFn()); // 这样写将触发 longTimeFn 1000 次执行
      tasks.push(guard.call('key', longTimeFn)); // 仅一次执行
    }

    const getReason = (rejectItem: any) => rejectItem.reason;

    // 发起1000调用
    const results = await Promise.allSettled(tasks);
    // 只触发一次执行
    expect(runCtx.runCount).toBe(1);
    expect(results.length).toBe(1000);
    // 抽样核对结果，所有函数都应抛出错误
    expect(getReason(results[10])).toBe(errorObj);
    expect(getReason(results[101])).toBe(errorObj);
    expect(getReason(results[900])).toBe(errorObj);
  });

  test('set cacheResult = true', async () => {
    const { longTimeFn, runCtx } = makeLongTimeFn(null, () => 888);
    const guard = new ConcurrencyGuard({ cacheResult: true });
    const key = 'test cacheResult';

    const check = async () => {
      let result = await guard.waitResult(key);
      expect(result).toBe(undefined);

      // 等待 guard resultPromise 就绪
      const delayMS = 200;
      await delay(delayMS);

      const start1 = Date.now();
      result = await guard.waitResult(key);
      // 正常获取到 resultPromise 求值结果
      expect(result).toBe(888);
      // 耗时应该是>= (3000-delayMS) 毫秒的，给 10 毫秒误差值
      expect(Date.now() - start1).toBeGreaterThanOrEqual(3000 - (delayMS + 10));

      const start2 = Date.now();
      result = await guard.waitResult(key);
      // 正常获取到已缓存结果
      expect(result).toBe(888);
      // 直接复用了已缓存结果，故耗时应该是很短的
      expect(Date.now() - start2).toBeLessThan(2);
    };

    // 开启检查
    const checkProm = check();

    const result = await guard.call(key, longTimeFn);
    expect(result).toBe(888);
    expect(runCtx.runCount).toBe(1);

    // 等待检查里的测试用例跑完
    await checkProm;
  });

  test('normal member method shoud call bind(this)', async () => {
    // 触发 guard.call 调用类成员函数时使用 bind(this) 语法
    const wrap = new DBWrap('callInitWithBindThis');
    const result = await wrap.get('hello');
    expect(result).toBe('hello:result');

    // 触发 guard.call 调用类成员箭头函数
    const wrap2 = new DBWrap('callInitWithArrowFn');
    const result2 = await wrap2.get('hello');
    expect(result2).toBe('hello:result');

    // 触发 guard.call 调用匿名箭头函数
    const wrap3 = new DBWrap('callInitWithAnonymousArrowFn');
    const result3 = await wrap3.get('hello');
    expect(result3).toBe('hello:result');

    try {
      // 直接调用类普通函数，this 丢失，导致报错
      const wrap = new DBWrap('callInitDirectly');
      await wrap.get('hello');
    } catch (err: any) {
      expect(err.message).toMatch(/(?=Cannot read properties of null)/);
    }
  });
});
