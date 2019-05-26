import ccContext from '../../cc-context';
import { ERR } from '../../support/constant'
import util from '../../support/util'
import setConnectedState from '../state/set-connected-state';

const { makeError: me, throwCcHmrError } = util;

export default function (ccClassKey, moduleName, originalSharedStateKeys, originalGlobalStateKeys,
  sharedStateKeys, globalStateKeys, stateToPropMapping, forCcFragment = false) {

  const contextMap = ccContext.ccClassKey_ccClassContext_;
  const _computedValue = ccContext.computed._computedValue;
  

  let ccClassContext = contextMap[ccClassKey];
  if (forCcFragment === true) {
    //对于CcFragment的调用，ccClassContext可能是已存在的，因为cc根据CcFragment的connect参数为当前CcFragment分配一个ccClassKey，
    //多个CcFragment实例的connect一样的话，会被分配给同一个ccClassKey
    if (ccClassContext === undefined) {
      ccClassContext = util.makeCcClassContext(moduleName, ccClassKey, sharedStateKeys, globalStateKeys, originalSharedStateKeys, originalGlobalStateKeys);
    }
  } else {
    //对于register调用，ccClassContext一定是不存在的, 如果存在就报错
    if (ccClassContext !== undefined) {
      throwCcHmrError(me(ERR.CC_CLASS_KEY_DUPLICATE, `ccClassKey:${ccClassKey} duplicate`))
    }
    ccClassContext = util.makeCcClassContext(moduleName, ccClassKey, sharedStateKeys, globalStateKeys, originalSharedStateKeys, originalGlobalStateKeys);
  }

  const connectedModule = {};
  const connectedComputed = {};
  if (stateToPropMapping) {
    const _state = ccContext.store._state;
    const connectedState = ccClassContext.connectedState;
    const prefixedKeys = Object.keys(stateToPropMapping);
    const len = prefixedKeys.length;

    for (let i = 0; i < len; i++) {
      const prefixedKey = prefixedKeys[i];
      const [targetModule, targetStateKey] = prefixedKey.split('/');// prefixedKey : 'foo/f1'
      connectedModule[targetModule] = 1;
      const moduleState = _state[targetModule];
      setConnectedState(connectedState, targetModule, targetStateKey, moduleState[targetStateKey]);

      if(!connectedComputed[targetModule]){//绑定_computedValue的引用到connectedComputed上
        connectedComputed[targetModule] = _computedValue[targetModule];
      }
    }
    
    ccClassContext.stateToPropMapping = stateToPropMapping;
    ccClassContext.connectedModule = connectedModule;
    ccClassContext.connectedComputed = connectedComputed;
  }

  contextMap[ccClassKey] = ccClassContext;
}