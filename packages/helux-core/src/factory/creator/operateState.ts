import { getVal, matchDictKey, nodupPush } from '@helux/utils';
import { IOperateParams } from 'limu';
import { recordFnDepKeys } from '../../helpers/fnDep';
import type { KeyIdsDict, NumStrSymbol } from '../../types/base';
import { getRunningFn } from '../common/fnScope';
import { cutDepKeyByStop } from '../common/stopDep';
import { getDepKeyByPath, IMutateCtx, isArrLike } from '../common/util';
import type { TInternal } from './buildInternal';

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

export function handleOperate(opParams: IOperateParams, opts: { internal: TInternal; mutateCtx: IMutateCtx }) {
  const { isChanged, fullKeyPath, keyPath, parentType } = opParams;
  const { internal, mutateCtx } = opts;
  const { arrKeyDict } = mutateCtx;
  const { sharedKey, enableDraftDep } = internal;
  const arrLike = isArrLike(parentType);

  if (!isChanged) {
    if (enableDraftDep && getRunningFn().fnCtx) {
      // 支持对draft操作时可以收集到依赖： draft.a = draft.b + 1
      // atom 判断一下长度，避免记录根值依赖导致死循环
      const canRecord = internal.forAtom ? fullKeyPath.length > 1 : true;
      canRecord && recordFnDepKeys([getDepKeyByPath(fullKeyPath, sharedKey)], { sharedKey });
    }
    if (arrLike) {
      arrKeyDict[getDepKeyByPath(keyPath, sharedKey)] = 1;
    }
    return;
  }
  // 具体是否需要通知相关函数重执行见 notify 逻辑，里面包含了孩子节点值比较过程

  const { moduleName, ruleConf, level1ArrKeys } = internal;
  const { writeKeyPathInfo, ids, globalIds, writeKeys } = mutateCtx;
  mutateCtx.level1Key = fullKeyPath[0];
  mutateCtx.handleAtomCbReturn = false;

  // 主动把数组自身节点 key 也记录一下
  if (arrLike) {
    const arrKey = getDepKeyByPath(keyPath, sharedKey);
    writeKeyPathInfo[arrKey] = { sharedKey, moduleName, keyPath };
    writeKeys[arrKey] = 1;
  }

  const { hasIds, hasGlobalIds, stopDepInfo } = ruleConf;
  const writeKey = getDepKeyByPath(fullKeyPath, sharedKey);
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
}
