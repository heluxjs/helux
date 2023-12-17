import { Fn, From, IInnerSetStateOptions } from './base';

/**
 * 第一层路径的数组 key 集合，会在不停地读取过程中动态新增
 * 多层结构中存在多个数组时，例如：a.b.list[].c.d.list[]，
 * 只记录第一个 a.b.list
 */
export type Level1ArrKeys = string[];

export type DepKeyInfo = {
  depKey: string;
  keyPath: string[];
  parentKeyPath?: string[];
  sharedKey: number;
};

export interface IReactive {
  finish: (val: any, options: IInnerSetStateOptions) => any;
  draft: any;
  modified: boolean;
  expired: boolean;
  sharedKey: number;
  data: [any];
  hasFlushTask: boolean;
  nextTickFlush: (desc?: string) => void;
}

export interface IReactiveMeta {
  /**
   * 是否是顶层 reactive 对象
   * const { reactive } = atomx(1); // 顶层提供
   * action(async({ draft })=>{ draft }); // 实例提供
   */
  isTop: boolean;
  key: string;
  /** 操作 reactive 时，可能存在的真正执行的 watch 函数 key */
  fnKey: string;
  sharedKey: number;
  moduleName: string;
  /**
   * mutate task 提供的 reactive 对象所指向的 fnItem 的依赖项
   * 注：isTop=false 时，reactive 由 task 提供
   */
  depKeys: string[];
  /**
   * reactive 改变了的 keys，用于辅助 fnRunner 里发现死循环
   */
  writeKeys: string[];
  /**
   * reactive 对象由 Reactive 场提供还是其他，例如 Mutate Action
   */
  from: From;
  desc: string;
  onRead?: Fn;
}
