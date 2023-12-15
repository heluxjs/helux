import { enureReturnArr, isFn } from '@helux/utils';
import { checkSharedStrict } from '../factory/common/check';
import type { TInternal } from '../factory/creator/buildInternal';
import { DEPS_CB } from '../factory/creator/current';
import { updateIns } from '../factory/creator/notify';
import type { CoreApiCtx } from '../types/api-ctx';
import type { Dict } from '../types/base';

function getDepKeyDict<T = any>(internal: TInternal, deps?: (sharedState: T) => any[], defaultDict?: any) {
  if (deps === null) {
    return defaultDict;
  }
  if (!isFn(deps)) {
    return null;
  }
  // atom 自动拆箱
  const { sharedState, forAtom } = internal;
  const rootVal = forAtom ? sharedState.val : sharedState;

  const depKeyDict: Dict = {};
  DEPS_CB.set((keys: string[]) => (depKeyDict[keys[0]] = 1));
  const depItems = enureReturnArr(deps, rootVal);
  DEPS_CB.del();
  // 返回了自身则表示更新所有实例
  if (depItems.includes(rootVal)) {
    return internal.key2InsKeys;
  }

  return depKeyDict;
}

/**
 * 慎用此功能，会造成使用了某个共享状态的所以实例被强制更新
 */
export function useAtomForceUpdate<T = any>(apiCtx: CoreApiCtx, sharedState: T, presetDeps?: (sharedState: T) => any[]) {
  const internal = checkSharedStrict(sharedState);
  const [presetDepKeyDict] = apiCtx.react.useState(() => {
    return getDepKeyDict(internal, presetDeps, null);
  });

  // 返回的 forceUpdate 句柄支持再次设置 deps 覆盖预设的 deps
  return (overWriteDeps?: (sharedState: T) => any[]) => {
    const { insCtxMap, key2InsKeys } = internal;
    // 未设定 deps 时，更新所有依赖 key 对应的实例
    // 支持 forceUpdate = useAtomForceUpdate( deps ) 预设，也支持 forceUpdate( deps ) 时重写
    // overWriteDeps 为 null 的话表示强制覆盖掉 overWriteDeps 设置的依赖，并更新所有实例
    const depKeyDict = getDepKeyDict(internal, overWriteDeps, key2InsKeys) || presetDepKeyDict || key2InsKeys;

    const insKeyDict: Dict<number> = {};
    // 查找到绑定了依赖关系的各个实例，用字典去重
    Object.keys(depKeyDict).forEach((depKey) => {
      const insKeys = key2InsKeys[depKey] || [];
      insKeys.forEach((insKey) => (insKeyDict[insKey] = 1));
    });

    const insKeys = Object.keys(insKeyDict);
    if (insKeys.length) {
      // sn 更新批次加一
      internal.sn += 1;
      const nextSn = internal.sn;
      // 开始遍历并更新所有实例
      Object.keys(insKeyDict).forEach((insKey) => {
        updateIns(insCtxMap, Number(insKey), nextSn);
      });
    }
  };
}
