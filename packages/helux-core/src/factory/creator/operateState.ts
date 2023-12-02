import { matchDictKey, nodupPush, prefixValKey } from '@helux/utils';
import { IOperateParams } from 'limu';
import { recordFnDepKeys } from '../../helpers/fnDep';
import type { KeyIdsDict, NumStrSymbol } from '../../types/base';
import { getRunningFn } from '../common/fnScope';
import { cutDepKeyByStop } from '../common/stopDep';
import { getDepKeyByPath, IMutateCtx } from '../common/util';
import type { TInternal } from './buildInternal';

export function handleOperate(opParams: IOperateParams, opts: { internal: TInternal; mutateCtx: IMutateCtx }) {
  const { isChange, fullKeyPath, keyPath, parentType } = opParams;
  const { internal, mutateCtx } = opts;
  const { arrKeyDict } = mutateCtx;
  const { sharedKey } = internal;

  if (!isChange) {
    if (getRunningFn().fnCtx) {
      // 支持对draft操作时可以收集到依赖： draft.a = draft.b + 1
      // atom 判断一下长度，避免记录根值依赖导致死循环
      const canRecord = internal.forAtom ? fullKeyPath.length > 1 : true;
      canRecord && recordFnDepKeys([getDepKeyByPath(fullKeyPath, sharedKey)], { sharedKey });
    }
    if (parentType === 'Array') {
      arrKeyDict[getDepKeyByPath(keyPath, sharedKey)] = 1;
    }
    return;
  }
  // 对于 limu 来说触发 set 就算变化了，如将来需要配置特性【丢弃无变化的值】，
  // 具体是否需要通知相关函数重执行见 notify 逻辑，里面包含了值比较过程

  const { moduleName, exact, ruleConf, level1ArrKeys } = internal;
  const { writeKeyPathInfo, ids, globalIds, writeKeys } = mutateCtx;
  mutateCtx.level1Key = fullKeyPath[0];
  mutateCtx.handleAtomCbReturn = false;

  // 主动把数组自身节点 key 也记录一下
  if (parentType === 'Array') {
    const arrKey = getDepKeyByPath(keyPath, sharedKey);
    writeKeyPathInfo[arrKey] = { sharedKey, moduleName, keyPath };
    writeKeys[arrKey] = 1;
  }

  const { idsDict, globalIdsDict, stopDepInfo } = ruleConf;
  const writeKey = getDepKeyByPath(fullKeyPath, sharedKey);
  writeKeyPathInfo[writeKey] = { sharedKey, moduleName, keyPath: fullKeyPath };

  // 设定了非精确更新策略时，提取出第一层更新路径即可
  if (!exact) {
    const keyPrefix = prefixValKey('', sharedKey); // as namespace
    const level1Key = `${keyPrefix}${fullKeyPath[0]}`;
    writeKeys[level1Key] = 1;
    return;
  }
  // 用户设定了精确更新策略，则只查当前更新路径的视图

  // 筛出当前写入 key 对应的可能存在的数组 key
  const arrKey = matchDictKey(arrKeyDict, writeKey);
  if (arrKey) {
    // 主动把数组key也记录下，因为数组对应视图通常都用 forEach 生成的
    // 然后遍历出来的孩子节点都会包一个 memo，所以需主动通知一下使用数组根节点的组件重渲染
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

  // 如果变化命中了 rules[].ids 或 globaIds 规则，则添加到 mutateCtx.ids 或 globalIds 里
  const putId = (keyIds: KeyIdsDict, ids: NumStrSymbol[]) => {
    // find update ids configured in rules
    Object.keys(keyIds).forEach((confKey) => {
      // writeKey: 1/a|list|0|name
      // confKey: 1/a|list
      if (writeKey.startsWith(confKey)) {
        keyIds[confKey].forEach((id) => nodupPush(ids, id));
      }
    });
  };
  putId(idsDict, ids);
  putId(globalIdsDict, globalIds);
}
