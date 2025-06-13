import { createFlatPromise, FlatPromise } from './flat-promise';

export interface IGuardOptions {
  /**
   * default: true
   * 是否缓存函数运行结果
   */
  cacheResult?: boolean;
}

/**
 * 并发保护类，标识了相同key的多个函数在高并发场景同时执行时，只有一个函数会真正执行，其他的则进入等待并复用此函数结果
 * @example
 * ```ts
 * const guard = new ConcurrencyGuard();
 * await guard.call('key', heavyAsyncFn, 1, 2, 3);
 * await guard.apply('key', heavyAsyncFn, [1, 2, 3]);
 * ```
 */
export class ConcurrencyGuard {
  /** 运行中的 promise 对象 map */
  private runningPromiseMap: Map<string, FlatPromise<any>> = new Map();

  /** 记录运行中的 promise 是否已被获取 */
  private runningPromiseGettedMap: Map<string, boolean> = new Map();

  /** 缓存运行过的函数结果 */
  private resultMap: Map<string, any> = new Map();

  /** 是否缓存函数运行结果 */
  private cacheResult = false;

  constructor(options?: IGuardOptions) {
    const { cacheResult = false } = options || {};
    this.cacheResult = cacheResult;
  }

  /**
   * 标识key并调用函数，通过可变参数透传参数给函数参数，标识了相同key的多个函数在高并发时只有一个被执行，其他函数等待结果
   * @example - 自动推导类型
   * ```ts
   * const result = await guard.call('key', (p1, p2) => Promise.resolve([p1, p2]), 1, 2);
   * ```
   * @example - 通过泛型标注类型
   * ```ts
   * const result = await guard.call<number, [number, number]>('key', (p1, p2) => Promise.resolve(1), 1, 2);
   * ```
   */
  public async call<T extends any = any, A extends any[] = any[]>(
    key: string,
    asyncFn: (...args: A) => Promise<T>,
    ...args: A
  ) {
    return this.run({ key, asyncFn, isCall: true }, ...args);
  }

  /**
   * 标识key并调用函数，通过参数列表透传参数给函数参数，标识了相同key的多个函数在高并发时只有一个被执行，其他函数等待结果
   * @example
   * ```
   * // [1,2] 透传给 asyncFn 的 p1、p2
   * const result = await guard.apply('key', (p1: number, p2: number) => Promise.resolve([p1, p2]), [1, 2]);
   * ```
   */
  public async apply<T extends any = any, A extends any[] = any[]>(
    key: string,
    asyncFn: (...args: A) => Promise<T>,
    args: A,
  ) {
    return this.run({ key, asyncFn, isCall: false }, args);
  }

  /**
   * 等待函数运行结果，如果函数存在且正在运行中，返回 promise 对象等待调用方获取，
   * 如果函数已运行结束且配置了 cacheResult=true，返回记录的缓存结果，
   * 其他情况则返回 undefined，用户需自行处理此情况
   */
  public async waitResult<T extends any = any>(key: string): Promise<T | undefined> {
    const { runningPromise, isExist } = this.getRunningPromise(key);
    if (!isExist) {
      return this.resultMap.get(key);
    }
    return runningPromise;
  }

  /**
   * 获取运行中的 promise
   */
  private getRunningPromise<T extends any = any>(key) {
    const runningPromise: FlatPromise<T> = this.runningPromiseMap.get(key);
    // 避免es-lint: Expected non-Promise value in a boolean conditional  @typescript-eslint/no-misused-promises
    const isExist = Boolean(runningPromise);
    if (isExist) {
      // 标记已被获取
      this.runningPromiseGettedMap.set(key, true);
    }
    return { isExist, runningPromise };
  }

  /**
   * 配合 flatPromise 和 reqKey，控制高并发时只有一个真正发起请求，其他函数等待结果
   */
  private async run<T = any>(
    runCtx: { key: string, asyncFn: () => Promise<T>, isCall: boolean },
    ...args: any[]
  ): Promise<T> {
    const { key, asyncFn, isCall } = runCtx;
    const { runningPromise, isExist } = this.getRunningPromise<T>(key);
    if (isExist) {
      // 极短时间里已有相同标记的请求发出但还未拿到结果，此处等待结果即可
      const result = await runningPromise;
      return result;
    }

    // 用这个promise来记录结果，对于其他执行中的函数来说，此对象就是 runningPromise
    const resultProm = createFlatPromise<T>();
    this.runningPromiseMap.set(key, resultProm);
    try {
      let result;
      if (isCall) {
        result = await asyncFn.call(null, ...args);
      } else {
        // 尽管 apply 函数做了类型纠错检查，为了防止使用 ts-ignore 绕过检测，此处需在运行时确保参数格式合法性
        const fisrtArg = args[0];
        const argArr = Array.isArray(fisrtArg) ? fisrtArg : [fisrtArg];
        result = await asyncFn.apply(null, argArr);
      }

      if (this.cacheResult) {
        this.resultMap.set(key, result);
      }

      this.runningPromiseMap.delete(key);
      this.runningPromiseGettedMap.delete(key);
      resultProm.resolve(result); // 通知可能存在的并发执行的其他函数获得结果

      return result;
    } catch (err: any) {
      this.runningPromiseMap.delete(key);
      // 通知可能存在的并发执行的其他函数捕捉错误，
      // 用于承载结果的 promise 必须判定已被获取后，才需要执行 reject 操作，
      // 否则会产生 unhandledRejection 错误到运行时顶层
      if (this.runningPromiseGettedMap.get(key)) {
        this.runningPromiseGettedMap.delete(key);
        resultProm.reject(err);
      }
      throw err;
    }
  }
}
