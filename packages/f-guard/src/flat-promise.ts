export type FlatPromise<T = any> = Promise<T> & { resolve: any; reject: any };

/**
 * 创建一个可脱离回调修改状态的扁平化 Promise，简化接收异步结果的写法，在处理复杂的控制流语句场景时更方便、更灵活。
 * @example
 * ```ts
 * async function getIns(databaseName, version) {
 *   // with new Promise()
 *   const promise = new Promise((resolve, reject) => {
 *     const request = window.indexedDB.open(databaseName, version);
 *     request.onsuccess = () => resolve(request.result);
 *     request.onerror = (event) => reject(event);
 *   });
 *
 *   // with createFlatPromise()
 *   const promise = createFlatPromise();
 *   const request = window.indexedDB.open(databaseName, version);
 *   request.onsuccess = () => promise.resolve(request.result);
 *   request.onerror = (event) => promise.reject(event);
 *
 *   // return promise ins
 *   return promise;
 * }
 * ```
 */
export function createFlatPromise<T = any>() {
  let resolve;
  let reject;
  /**
   * 注：不写为 class FlatPromise extends Promise { ... } 是因为
   * constructor 里调用 super() 绑定的 resolve，reject 无法通过单测，
   * 报错：Promise resolve or reject function is not callable。
   * 不写为类似 class FlatPromise { consturctor(){ return new Promise() } } 代码
   * 是因为 await 类型推导丢失。
   */
  const promise = new Promise((r, j) => {
    resolve = r;
    reject = j;
  });
  // 此处 as 断言是安全的，之后的两行代码补上了相关实现
  const flatPromise = promise as FlatPromise<T>;
  flatPromise.resolve = resolve;
  flatPromise.reject = reject;
  return flatPromise;
}
