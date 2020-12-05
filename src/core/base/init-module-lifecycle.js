
import ccContext from '../../cc-context';
import { makeSetStateHandler, makeModuleDispatcher } from '../state/handler-factory';

const getState = ccContext.store.getState;

export default function (moduleName, lifecycle = {}) {
  const { initState, initStateDone, loaded } = lifecycle;// 对接原来的 moduleConf.init initPost
  ccContext.lifecycle._lifecycle[moduleName] = lifecycle;
  const moduleState = getState(moduleName);

  const d = makeModuleDispatcher(moduleName);
  // loaded just means that moudle state、reducer、watch、computed configuration were recorded to ccContext
  // so it is called before initState
  if (loaded) {
    loaded(d, moduleState);
  }

  if (initState) {
    Promise.resolve().then(() => initState(moduleState)).then(state => {
      makeSetStateHandler(moduleName, initStateDone)(state);
    }).catch(ccContext.runtimeHandler.tryHandleError);
  } else {
    // make sure initStateDone will be alway called no matther initState difined or not
    initStateDone && initStateDone(d, moduleState);
  }
}
