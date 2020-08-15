
import ccContext from '../../cc-context';
import { makeSetStateHandler, makeModuleDispatcher } from '../state/handler-factory';
import catchCcError from './catch-cc-error';

const getState = ccContext.store.getState;

export default function (moduleName, lifecycle = {}) {
  const { initState, initStateDone, moduleLoaded } = lifecycle;// 对接原来的 moduleConf.init initPost
  ccContext.lifecycle._lifecycle[moduleName] = lifecycle;
  const moduleState = getState(moduleName);

  if (initState) {
    Promise.resolve().then(() => initState(moduleState)).then(state => {
      makeSetStateHandler(moduleName, initStateDone)(state);
    }).catch(catchCcError);
  }

  if (moduleLoaded) {
    moduleLoaded(makeModuleDispatcher(moduleName), moduleState);
  }
}
