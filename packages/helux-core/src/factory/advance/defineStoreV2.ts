import { withAtom } from '../../class';
import type { CoreApiCtx } from '../../types/api-ctx';
import type { IWithStoreOptions } from '../../types/base';
import type { IDefineStoreOptions } from '../../types/define-store';
import { sharex } from '../createShared';

export function defineStore(apiCtx: CoreApiCtx) {
  return (options: IDefineStoreOptions) => {
    const { stateOptions, derivedOptions, moduleName, lifecycle = {} } = options;
    const ctx = sharex(apiCtx, options.state, { moduleName, ...(stateOptions || {}) });
    const { state, reactive } = ctx;

    // 定义生命周期
    ctx.defineLifecycle(lifecycle);

    // 使用 defineMutateDerive 来承接 derived 定义
    const derivedDef = options.derived || {};
    const mutateDeriveInput: any = {};
    const derivedStateInit: any = {};
    const getDerived = () => dm.derivedState;
    Object.keys(derivedDef).forEach((key) => {
      derivedStateInit[key] = undefined;
      // mutateDeriveInput[key] = (derivedDraft: any) => derivedDef[key]({ state, derivedDraft });
      mutateDeriveInput[key] = (draft: any) => {
        draft[key] = derivedDef[key]({ state, getDerived });
      };
    });
    const dm = ctx.defineMutateDerive(derivedStateInit, derivedOptions)(mutateDeriveInput);

    // 使用 defineActions 来承接 actions 定义
    const actionsDef = options.actions || {};
    const actionsInput: any = {};
    Object.keys(actionsDef).forEach((key) => {
      actionsInput[key] = ({ draft, payload }: any) => {
        return options.actions[key]({ state: draft, payload, derived: dm.derivedState });
      };
    });
    const { actions, useLoading, getLoading } = ctx.defineActions()(actionsInput);

    return {
      useState: () => {
        const tuple = ctx.useState();
        return tuple;
      },
      useDerived: () => {
        const [derived] = dm.useDerivedState();
        // dirived 拒绝修改，故此处仅返回 derived
        return derived;
      },
      useLoading,
      actions,
      state,
      reactive,
      derived: dm.derivedState,
      getLoading,
      // 提供给 class 组件绑定 store 之用
      withStore: (ClassComp: any, options?: IWithStoreOptions) =>
        withAtom(ClassComp, { ...(options || {}), atom: state, derivedAtom: dm.derivedState }),
    };
  };
}
