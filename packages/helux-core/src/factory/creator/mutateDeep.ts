import { nodupPush } from '@helux/utils';
import { createDraft, finishDraft, IOperateParams } from 'limu';
import { OP_KEYS } from '../../consts';
import { markIgnore } from '../../helpers/fnDep';
import type { Dict, IInnerSetStateOptions, IMutateCtx, ISetFactoryOpts, SharedState } from '../../types/base';
import { newMutateCtx } from '../common/ctor';
import { runMiddlewares } from '../common/middleware';
import { emitDataChanged } from '../common/plugin';
import { isDict } from '../common/util';
import type { TInternal } from './buildInternal';
import { handleCustomKey } from './buildShared';
import { commitState } from './commitState';
import { DRAFT_ROOT, MUTATE_CTX } from './current';
import { handleOperate } from './operateState';

export interface IPrepareMutateOpts {
  internal: TInternal;
  setFactoryOpts: ISetFactoryOpts;
}

export interface ICommitOpts {
  internal: TInternal;
  mutateCtx: IMutateCtx;
  state: any;
}

interface IHandlePartialOpts {
  forAtom: boolean;
  partial: any;
  draftRoot: any;
  draftNode: any;
}

function handleDict(draftNode: any, dict: Dict) {
  // [object Object]
  Object.keys(dict).forEach((key) => {
    // 触发 writeKeys 里记录当前变化key
    draftNode[key] = dict[key];
  });
}

/**
 * 如果是 atom 则返回拆箱后的值
 */
export function getStateNode(sharedState: SharedState, forAtom: boolean) {
  if (!forAtom) {
    return sharedState;
  }
  // atom 自动拆箱时，sharedState.val 会产生一次影响运行逻辑的依赖收集，这里标记一下 ignore
  markIgnore(true); // stop dep collect
  const state = sharedState.val;
  markIgnore(false); // recover dep collect
  return state;
}

export function handlePartial(opts: IHandlePartialOpts) {
  const { partial, forAtom, draftRoot, draftNode } = opts;
  if (!partial) {
    return;
  }

  // 非 atom setState 返回值，只对字典做浅合并
  if (!forAtom) {
    isDict(partial) && handleDict(draftNode, partial);
    return;
  }

  const val = partial.val;
  if (isDict(draftNode)) {
    if (isDict(val)) {
      handleDict(draftNode, val);
    } else {
      console.warn('dict atom deny to handle a non-dict returned value!');
    }
    return;
  }

  // !!! 用户需为数据类型变异担责，
  // 例如 定义的是数组 []，返回的是 pritimive，会导致其他错误产生
  draftRoot.val = val;
}

/**
 * mutateNormal 和 mutateDepp 的 finishMutate 里提交之前可复用的公共逻辑
 */
function beforeCommit(opts: ICommitOpts, draftRoot: any, moduleName: string) {
  const { internal, mutateCtx } = opts;
  const draft = getStateNode(draftRoot, internal.forAtom);
  const { from, sn, desc } = mutateCtx;
  internal.lifecycle.beforeCommit({ from, draftRoot, draft, desc, sn, moduleName });
  runMiddlewares(internal, draftRoot, draft, sn);
}

export function fillMutateCtx(mutateCtx: IMutateCtx, innerSetOptions: IInnerSetStateOptions) {
  const { ids, globalIds, from, desc, fnKey, payloadArgs } = innerSetOptions;
  // 用户 setState 可能设定了 ids globalIds
  if (ids) {
    ids.forEach((id) => nodupPush(mutateCtx.ids, id));
  }
  if (globalIds) {
    globalIds.forEach((id) => nodupPush(mutateCtx.globalIds, id));
  }
  // 内部可能重写 from
  from && (mutateCtx.from = from);
  // 内部可能重写 desc
  desc && (mutateCtx.desc = desc);
  // 可能来自于 mutate 函数调用
  fnKey && (mutateCtx.fnKey = fnKey);
  if (payloadArgs !== undefined) {
    mutateCtx.payloadArgs = payloadArgs;
  }
}

/**
 * deep模式下，生成limu返回的草稿状态，用户可以对草稿做任意修改，且不会影响原状态
 * 此流程中会调用 createDraft 生成新的草稿
 */
export function prepareDeepMutate(opts: IPrepareMutateOpts) {
  const { internal, setFactoryOpts } = opts;
  const { forAtom, rawState } = internal;
  const mutateCtx = newMutateCtx(setFactoryOpts);
  const draftRoot = createDraft(rawState, {
    // fix issue https://github.com/heluxjs/helux/issues/166
    autoRevoke: false,
    customKeys: OP_KEYS,
    onOperate: (opParams: IOperateParams) => {
      if (opParams.isCustom) {
        return handleCustomKey(opParams, forAtom, internal.sharedKey);
      }
      handleOperate(opParams, { internal, mutateCtx });
    },
  });

  // 记录正在执行中的 draftRoot mutateCtx
  DRAFT_ROOT.set(draftRoot, forAtom);
  MUTATE_CTX.set(mutateCtx);
  const draftNode = getStateNode(draftRoot, forAtom);
  // atom draft 自动拆箱
  if (forAtom) {
    // 自动拆箱后，有一个隐含的 .val 读依赖被收集到 readKeys，此处刻意清空 readKeys
    // 不清空的话，如下例子因为有隐含的 .val 读取，和 .val 再赋值操作，会误判为有死循环存在
    // 清空了则 .val 读取被抹掉了，死循环探测逻辑就没有误判了
    // atomx(0).mutate(()=>anotherAtom.val+1);
    // 如果人为对 val 读取再赋值，例如使用 draftRoot.val 操作，则探测出存在死循环
    // atomx(0).mutate((draft, { draftRoot })=>draftRoot.val+=1);
    mutateCtx.readKeys = {};
  }

  return {
    draftRoot,
    draftNode,
    finishMutate(partial?: Dict, innerSetOptions: IInnerSetStateOptions = {}) {
      fillMutateCtx(mutateCtx, innerSetOptions);
      const commitOpts = { state: {}, mutateCtx, internal };
      execFinish(commitOpts, draftRoot, draftNode, partial);
    },
  };
}

/**
 * 此流程中调用 finishDraft 结束草稿
 */
export function execFinish(commitOpts: ICommitOpts, draftRoot: any, draftNode: any, partial?: Dict) {
  const { mutateCtx, internal } = commitOpts;
  const { writeKeys, writeKeyPathInfo, handleCbReturn, sn, desc, from } = mutateCtx;
  const { forAtom, moduleName, lifecycle } = internal;

  // setState 不忽略cb 返回值， setDraft 忽略
  if (handleCbReturn) {
    handlePartial({ partial, forAtom, draftRoot, draftNode });
  }

  if (lifecycle.hasBeforeCommit) {
    beforeCommit(commitOpts, draftRoot, moduleName);
  }

  mutateCtx.depKeys = Object.keys(writeKeys);
  DRAFT_ROOT.del();
  MUTATE_CTX.del();
  const nextState = finishDraft(draftRoot); // a structural shared obj generated by limu
  commitOpts.state = nextState;

  // 做了赋值操作但都是相同的值，结束后的草稿引用不会改变，这里直接结束 finish 流程
  // 例如 { a: { b: 1 } }
  // 某个地方操作 draft=>draft.a.b = 1; // 此操作并没有引起改变
  if (nextState === internal.rawState) {
    return;
  }

  mutateCtx.triggerReasons = Object.values(writeKeyPathInfo);
  commitState(commitOpts);
  emitDataChanged(internal, mutateCtx);
  internal.lifecycle.afterCommit({ snap: nextState, moduleName, sn, desc, from });
}
