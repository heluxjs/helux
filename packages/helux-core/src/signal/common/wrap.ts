import type { FunctionComponent } from '@helux/types';
import { getVal, noop } from '@helux/utils';
import { useDerivedSimpleLogic } from '../../hooks/common/useDerivedLogic';
import { useSharedSimpleLogic } from '../../hooks/common/useSharedLogic';
import type { CoreApiCtx } from '../../types/api-ctx';
import type { DerivedAtom, Dict, Fn } from '../../types/base';

export const alwaysEqual = () => true;

interface IWrapSignalComp {
  sharedKey: number;
  sharedState: Dict; // may derived result
  depKey: string;
  keyPath: string[];
  compare?: Fn;
}

/** for perf, no options here */
export function wrapComp(apiCtx: CoreApiCtx, Comp: any, displayName: string, needMemo?: boolean, compare?: Fn): FunctionComponent {
  const CompVar = Comp as FunctionComponent;
  CompVar.displayName = displayName;
  return needMemo ? apiCtx.react.memo(CompVar, compare) : CompVar;
}

export function wrapSignalComp(apiCtx: CoreApiCtx, options: IWrapSignalComp): FunctionComponent {
  const { sharedState, depKey, keyPath, compare, sharedKey } = options;
  const valHook = { get: noop };
  const Comp = function () {
    const insCtx = useSharedSimpleLogic(apiCtx, sharedState);
    insCtx.recordDep({ sharedKey, depKey, keyPath });
    const val = getVal(sharedState, keyPath);
    valHook.get = () => val;
    return val;
  };
  return wrapComp(apiCtx, Comp, 'HeluxPrimitiveSignal', true, compare);
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
