import type { FunctionComponent } from '@helux/types';
import { getVal } from '@helux/utils';
import { DICT } from '../../consts';
import { getDepKeyByPath } from '../../factory/common/util';
import { useAtomSimpleLogic } from '../../hooks/common/useAtomLogic';
import { useDerivedSimpleLogic } from '../../hooks/common/useDerivedLogic';
import type { CoreApiCtx } from '../../types/api-ctx';
import type { DerivedAtom, Dict, Fn } from '../../types/base';

export const alwaysEqual = () => true;
const noopVal = (val: any) => val;
interface IWrapSignalComp {
  sharedKey: number;
  sharedState: Dict; // may derived result
  depKey: string;
  keyPath: string[];
  compare?: Fn;
  format?: Fn;
}

function getAllPath(keyPath: string[]) {
  const paths: string[][] = [];
  for (let i = 1; i <= keyPath.length; i++) {
    paths.push(keyPath.slice(0, i));
  }
  return paths;
}

/** for perf, no options here */
export function wrapComp(apiCtx: CoreApiCtx, Comp: any, displayName: string, needMemo?: boolean, compare?: Fn): FunctionComponent {
  const CompVar = Comp as FunctionComponent;
  CompVar.displayName = displayName;
  return needMemo ? apiCtx.react.memo(CompVar, compare) : CompVar;
}

export function wrapSignalComp(apiCtx: CoreApiCtx, options: IWrapSignalComp): FunctionComponent {
  const { sharedState, depKey, keyPath, compare, sharedKey, format = noopVal } = options;
  const Comp = function () {
    const insCtx = useAtomSimpleLogic(apiCtx, sharedState, { arrDep: true });
    if (insCtx.isFirstRender) {
      if (keyPath.length >= 2) {
        const paths = getAllPath(keyPath);
        // 基于不对称记录机制，这里需要把走过的父路径都记录一遍
        paths.forEach((keyPath) => {
          insCtx.recordDep(
            {
              sharedKey,
              depKey: getDepKeyByPath(keyPath, sharedKey),
              keyPath,
              parentKeyPath: keyPath.slice(0, keyPath.length - 1),
            },
            DICT,
          ); // 默认父节点都是 Dict，让 recordDep 内部逻辑按最长读取路径来记录
        });
      } else {
        insCtx.recordDep({ sharedKey, depKey, keyPath });
      }
    }
    // 此处用 rawState 替代 sharedState 依然获取最新的状态，同时也减少了代理对象获取的额外运行损耗
    const val = getVal(insCtx.internal.rawState, keyPath);
    return format(val);
  };
  return wrapComp(apiCtx, Comp, 'HeluxSignal', true, compare);
}

export function wrapDerivedAtomSignalComp(apiCtx: CoreApiCtx, derivedAtom: DerivedAtom, compare?: Fn): FunctionComponent {
  const Comp = function () {
    const fnCtx = useDerivedSimpleLogic(apiCtx, { result: derivedAtom, forAtom: true });
    return fnCtx.proxyResult.val as any; // auto unbox atom result
  };
  return wrapComp(apiCtx, Comp, 'HeluxDerivedAtomSignal', true, compare);
}

export function wrapDerivedSignalComp(apiCtx: CoreApiCtx, derivedResult: DerivedAtom, keyPath: string[], compare?: Fn) {
  const Comp = function () {
    useDerivedSimpleLogic(apiCtx, { result: derivedResult, forAtom: false });
    return getVal(derivedResult, keyPath);
  };
  return wrapComp(apiCtx, Comp, 'HeluxDerivedSignal', true, compare);
}
