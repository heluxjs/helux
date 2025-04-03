import type { Dict } from 'helux';
import {
  GettersProp,
  HeluxOptions,
  IDefineLayeredStoreOptions,
  IDefineStoreOptions,
  ILayeredStoreCtx,
  IStoreCtx,
  MergeActions,
  MergeGetters,
  StateWrap,
} from './src/types';
export * from './src/types';

/**
 * 确保透传给 defineLayeredStore 使用的 options 独立定义时，
 * this 能正常访问到 state、getters、actions。
 * @param options
 */
export declare function withLayeredOptionsThis<S extends Dict, G extends Dict, A extends Dict>(options: {
  state: (() => S) | S;
  getters: G & ThisType<StateWrap<S> & GettersProp<G>>;
  actions: A & ThisType<StateWrap<S> & A & GettersProp<G>>;
}): {
  state: (() => S) | S;
  getters: G & ThisType<StateWrap<S> & GettersProp<G>>;
  actions: A & ThisType<StateWrap<S> & A & GettersProp<G>>;
};

/**
 * 确保分散到各个文件里透传给 defineLayeredStore 使用的 getters 配置里的 this
 * 能正常访问到分散到各个文件里的 state、和其他getters
 * @param state - 状态
 * @param gettersList - 其他 getters
 * @param last
 */
export declare function withLayeredGettersThis<S extends Dict, GS extends Dict[], L extends Dict>(
  state: (() => S) | S,
  gettersList: GS,
  last: L & ThisType<StateWrap<S> & MergeGetters<GS> & GettersProp<L>>,
): L;

/**
 * 确保分散到各个文件里透传给 defineLayeredStore 使用的 actions 配置里的 this
 * 能正常访问到分散到各个文件里的 state、getters、和其他actions
 * @param options
 */
export declare function withLayeredThis<S extends Dict, GS extends Dict[], AS extends Dict[], L extends Dict>(
  state: (() => S) | S,
  gettersList: GS,
  actionsList: AS,
  last: L & ThisType<StateWrap<S> & MergeGetters<GS> & MergeActions<AS> & L>,
): L;

/**
 * 调用 defineLayeredStore 创建 store 实例，state 独立存放的 store 里，
 * defineStore 配置里的 state，getters，actions 全部会合并到 store 实例上，
 * 而 defineLayeredStore 配置里的 state 会独立存放到 state 属性下，可通过 store.state 访问到
 */
export declare function defineLayeredStore<S extends Dict, G extends Dict, A extends Dict>(
  moduleName: string,
  storeOptions: IDefineLayeredStoreOptions<S, G, A>,
  heluxOptions?: HeluxOptions,
): ILayeredStoreCtx<S, G, A>;

/**
 * 确保透传给 defineStore 使用的 options 独立定义时，
 * this 能正常访问到 state、getters、actions。
 * @param options
 */
export declare function withOptionsThis<S extends Dict, G extends Dict, A extends Dict>(options: {
  state: (() => S) | S;
  getters: G & ThisType<S & GettersProp<G>>;
  actions: A & ThisType<S & A & GettersProp<G>>;
}): {
  state: (() => S) | S;
  getters: G & ThisType<S & GettersProp<G>>;
  actions: A & ThisType<S & A & GettersProp<G>>;
};

/**
 * 确保分散到各个文件里透传给 defineStore 使用的 getters 配置里的 this
 * 能正常访问到分散到各个文件里的 state、和其他getters
 * @param state - 状态
 * @param gettersList - 其他 getters
 * @param last
 */
export declare function withGettersThis<S extends Dict, GS extends Dict[], L extends Dict>(
  state: (() => S) | S,
  gettersList: GS,
  last: L & ThisType<S & MergeGetters<GS> & GettersProp<L>>,
): L;

/**
 * 确保分散到各个文件里透传给 defineStore 使用的 actions 配置里的 this
 * 能正常访问到分散到各个文件里的 state、getters、和其他actions
 * @param options
 */
export declare function withThis<S extends Dict, GS extends Dict[], AS extends Dict[], L extends Dict>(
  state: (() => S) | S,
  gettersList: GS,
  actionsList: AS,
  last: L & ThisType<S & MergeGetters<GS> & MergeActions<AS> & L>,
): L;

/**
 * 创建 store，选项里 state getters actions 将合并到生成的 store 实例上
 * @example
 * ```ts
 * const storeCtx = defineStore('BookStore', {
 *   // 定义状态（必须）
 *   state: () => ({ list: [] as IBook[], page: 1, size: 10, total: 8, mountCount: 0 }),
 *   // 定义带缓存的派生属性（可选）
 *   getters: {
 *     // 由 state 派生出 totalPlus，上游依赖不变化时此函数不再重复计算
 *     totalPlus() {
 *       return this.total + 1;
 *     },
 *     // 由其他 getters 派生出 totalPlus2，上游依赖不变化时此函数不再重复计算
 *     totalPlus2() {
 *      return this.totalPlus + 100;
 *    },
 *   },
 *   // 定义方法修改状态（可选）
 *   actions: {
 *     // 同步方法
 *     changeTotal(payload: number) {
 *       this.total = payload;
 *     },
 *     // 异步方法
 *     async fetchList(payload: { page: number, size: number }, p2: number) {
 *       console.log(payload.page, payload.size);
 *       await delay();
 *       const { list, total } = await Promise.resolve({
 *         list: [
 *           { id: '1', name: `state_${Date.now()}`, price: 100 },
 *           { id: '2', name: `helex_${Date.now()}`, price: 100 },
 *         ],
 *         total: 10,
 *       });
 *       this.list = list;
 *       this.total = total;
 *     },
 *   },
 *   // 定义生命周期（可选），包含 willMount mounted willUnmount, 含义见 ILifeCycle 定义，
 *   // lifecycle 方法可访问 actions 里的方法，也可以访问 state 并修改，
 *   // 但是在 actions 里是访问不到 lifecycle 的，只能由框架负责调用，
 *   lifecycle: {
 *     mounted() {
 *       this.mountCount += 1;
 *     },
 *   },
 * });
 * ```
 */
export declare function defineStore<S extends Dict, G extends Dict, A extends Dict>(
  moduleName: string,
  storeOptions: IDefineStoreOptions<S, G, A>,
  heluxOptions?: HeluxOptions,
): IStoreCtx<S, G, A>;
