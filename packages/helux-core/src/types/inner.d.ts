import { Fn, IInnerSetStateOptions, From, TriggerReason, NumStrSymbol } from './base';

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
  isReactive: boolean;
  key: string;
  sharedKey: number;
  moduleName: string;
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
