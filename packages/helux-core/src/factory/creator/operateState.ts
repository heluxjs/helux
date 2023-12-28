import { getVal, matchDictKey, nodupPush } from '@helux/utils';
import { IOperateParams } from 'limu';
import { FROM } from '../../consts';
import { recordBlockDepKey } from '../../helpers/blockDep';
import { recordFnDepKeys } from '../../helpers/fnDep';
import type { IMutateCtx, KeyIdsDict, NumStrSymbol } from '../../types/base';
import { recordLastest } from '../common/blockScope';
import { getRunningFn, getSafeFnCtx } from '../common/fnScope';
import { cutDepKeyByStop } from '../common/stopDep';
import { getDepKeyByPath, isArrLike } from '../common/util';
import type { TInternal } from './buildInternal';
import { REACTIVE_META } from './current';
import { markExpired, nextTickFlush } from './reactive';

const { MUTATE } = FROM;

/**
 * 如果变化命中了 rules[].ids 或 globaIds 规则，则添加到 mutateCtx.ids 或 globalIds 里
 */
function putId(keyIds: KeyIdsDict, options: { writeKey: string; ids: NumStrSymbol[]; internal: TInternal; opParams: IOperateParams }) {
  const { writeKey, ids, internal, opParams } = options;
  const { snap } = internal;
  const { fullKeyPath, value } = opParams;
  // find update ids configured in rules
  Object.keys(keyIds).forEach((confKey) => {
    // writeKey: 1/a|list|0|name
    // confKey: 1/a|list
    // writeKey 是配置 confKey 的孩子节点，且值已发送变化
    if (writeKey.startsWith(confKey) && getVal(snap, fullKeyPath) !== value) {
      keyIds[confKey].forEach((id) => nodupPush(ids, id));
    }
  });
}

/**
 * draft 和 reactive 对象触发此操作，处理状态变更操作并记录相关依赖，
 * 具体是否需要通知相关函数重执行见 notify 逻辑，里面还包含有孩子节点值比较过程
 */
export function handleOperate(opParams: IOperateParams, opts: { internal: TInternal; mutateCtx: IMutateCtx }) {
  const { isChanged, fullKeyPath, keyPath, parentType, value } = opParams;
  const { internal, mutateCtx } = opts;
  const { arrKeyDict, isReactive, readKeys } = mutateCtx;
  const { sharedKey } = internal;
  const arrLike = isArrLike(parentType);
  const currReactive = REACTIVE_META.current();

  // 是读操作
  if (opParams.op === 'get') {
    if (arrLike) {
      arrKeyDict[getDepKeyByPath(keyPath, sharedKey)] = 1;
    }
    const depKey = getDepKeyByPath(fullKeyPath, sharedKey);
    readKeys[depKey] = 1;

    // isReactive=true 表示 top reactive, ins reactive, top setState, top setDraft
    // 仅这四种类型的对象收集读依赖，其他任何场景的读操作无任何依赖收集行为产生，可以
    // 1 减轻运行负担，
    // 2 降低死循环可能性，例如在 watch 回调里调用顶层的 setState
    if (mutateCtx.enableDep) {
      // 支持对 draft 操作时可以收集到依赖： draft.a = draft.b + 1
      // 来自实例的定制读行为，目前主要是响应式对象会有此操作，
      // 因为多个实例共享了一个响应式对象，但需要有自己的读行为操作来为实例本身收集依赖
      // 注：全局响应式对象的读行为已将 currentOnRead 置空
      if (currReactive.onRead) {
        currReactive.onRead(opParams);
      } else {
        getRunningFn().fnCtx && recordFnDepKeys([depKey], { sharedKey });
        // 仅 top reactive 触发以下逻辑，为 block 收集依赖
        if (isReactive) {
          recordBlockDepKey([depKey]);
          recordLastest(sharedKey, value, internal.sharedState, depKey, fullKeyPath);
        }
      }
    }
    return;
  }

  // 无任何变化的写操作
  if (!isChanged) {
    return;
  }

  const { moduleName, ruleConf, level1ArrKeys } = internal;
  const { writeKeyPathInfo, ids, globalIds, writeKeys } = mutateCtx;
  const writeKey = getDepKeyByPath(fullKeyPath, sharedKey);

  // 是一个有效的 reactive
  if (currReactive.key) {
    if (currReactive.isTop) {
      nodupPush(currReactive.writeKeys, writeKey);
    } else if (currReactive.from === MUTATE) {
      nodupPush(getSafeFnCtx(currReactive.fnKey).subFnInfo.writeKeys || [], writeKey);
    }
  }

  // 主动把数组自身节点 key 也记录一下
  if (arrLike) {
    const arrKey = getDepKeyByPath(keyPath, sharedKey);
    writeKeyPathInfo[arrKey] = { sharedKey, moduleName, keyPath };
    writeKeys[arrKey] = 1;
  }

  const { hasIds, hasGlobalIds, stopDepInfo } = ruleConf;
  writeKeyPathInfo[writeKey] = { sharedKey, moduleName, keyPath: fullKeyPath };
  // 筛出当前写入 key 对应的可能存在的数组 key
  const arrKey = matchDictKey(arrKeyDict, writeKey);
  if (arrKey) {
    // 主动把数组 key 也记录下，因为数组对应视图通常都用 forEach 生成的
    // 然后遍历出来的孩子节点都会包一个 memo ，所以需主动通知一下使用数组根节点的组件重渲染
    writeKeys[arrKey] = 1;
  }

  // 可能在 recordCb 里缩短后再记录
  const depKeyInfo = { sharedKey, keyPath: fullKeyPath, depKey: writeKey };
  if (
    !cutDepKeyByStop(depKeyInfo, {
      stopDepInfo,
      level1ArrKeys,
      recordCb: (key) => {
        writeKeys[key] = 1;
      },
    })
  ) {
    writeKeys[writeKey] = 1;
  }

  if (hasIds) {
    putId(ruleConf.idsDict, { ids, writeKey, internal, opParams });
  }
  if (hasGlobalIds) {
    putId(ruleConf.globalIdsDict, { ids: globalIds, writeKey, internal, opParams });
  }

  // 是响应式对象在操作对象变更
  if (isReactive) {
    // 来自响应对象的变更操作，主动触发 nextTickFlush
    nextTickFlush(sharedKey, currReactive.desc);
  } else {
    // 发现 sharedKey 对应的对象已变化，主动标记 sharedKey 对应的响应对象已过期
    // 用户在其他地方再次使用 reactive 对象时，内部会自动创建一个新的返回给用户
    markExpired(sharedKey);
  }
}
