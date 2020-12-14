
import ccContext from '../../cc-context';
import { makeSetStateHandler, makeModuleDispatcher } from '../state/handler-factory';
import { isFn } from '../../support/util';

const getState = ccContext.store.getState;

export default function (moduleName, lifecycle = {}) {
  const { initState, initStateDone, loaded, willUnmount, mounted } = lifecycle;// 对接原来的 moduleConf.init initPost

  const validLifecycle = {};
  if (isFn(willUnmount)) validLifecycle.willUnmount = willUnmount;
  if (isFn(mounted)) validLifecycle.mounted = mounted;
  ccContext.lifecycle._lifecycle[moduleName] = validLifecycle;

  const moduleState = getState(moduleName);
  const d = makeModuleDispatcher(moduleName);
  // loaded just means that module state、reducer、watch、computed configuration were recorded to ccContext
  // so it is called before initState
  if (isFn(loaded)) {
    loaded(d, moduleState);
  }

  if (isFn(initState)) {
    Promise.resolve().then(() => initState(moduleState)).then(state => {
      makeSetStateHandler(moduleName, initStateDone)(state);
    }).catch(ccContext.runtimeHandler.tryHandleError);
  } else {
    // make sure initStateDone will be alway called no matther initState difined or not
    isFn(initStateDone) && initStateDone(d, moduleState);
  }
}
