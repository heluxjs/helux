import ccContext from '../../cc-context';
import { ERR } from '../../support/constant'
import util from '../../support/util'
import setPropState from './set-prop-state';

const { makeError: me, verboseInfo: vbi, throwCcHmrError } = util;

function _throwPropDuplicateError(prefixedKey, module) {
  throw me(`cc found different module has same key, you need give the key a alias explicitly! or you can set isPropStateModuleMode=true to avoid this error`,
    vbi(`the prefixedKey is ${prefixedKey}, module is:${module}`));
}

function _getPropKeyPair(isPropStateModuleMode, module, stateKey, propKey) {
  if (isPropStateModuleMode === true) {
    let derivedPropKey = '';
    if (propKey === '') derivedPropKey = stateKey;
    else derivedPropKey = propKey;
    
    const moduledPropKey = `${module}/${derivedPropKey}`;
    return { moduledPropKey, originalPropKey: propKey, derivedPropKey };
  } else {
    return { moduledPropKey: propKey, originalPropKey: propKey, derivedPropKey: propKey };
  }
}

export default function (ccClassKey, moduleName, originalSharedStateKeys, originalGlobalStateKeys,
  sharedStateKeys, globalStateKeys, stateToPropMapping, isPropStateModuleMode, forCcFragment = false) {

  let contextMap = ccContext.ccClassKey_ccClassContext_;
  let ccClassContext = contextMap[ccClassKey];
  if (forCcFragment === true) {
    //if this is called fro CcFragment, just reuse  ccClassContext;
    if (ccClassContext === undefined) {
      ccClassContext = util.makeCcClassContext(moduleName, ccClassKey, sharedStateKeys, globalStateKeys, originalSharedStateKeys, originalGlobalStateKeys);
    }
  } else {
    if (ccClassContext !== undefined) {
      throwCcHmrError(me(ERR.CC_CLASS_KEY_DUPLICATE, `ccClassKey:${ccClassKey} duplicate`))
    }
    ccClassContext = util.makeCcClassContext(moduleName, ccClassKey, sharedStateKeys, globalStateKeys, originalSharedStateKeys, originalGlobalStateKeys);
  }

  const _state = ccContext.store._state;
  const propModuleName_ccClassKeys_ = ccContext.propModuleName_ccClassKeys_;

  if (stateToPropMapping != undefined) {
    const propKey_stateKeyDescriptor_ = ccClassContext.propKey_stateKeyDescriptor_;
    const stateKey_propKeyDescriptor_ = ccClassContext.stateKey_propKeyDescriptor_;
    const propState = ccClassContext.propState;

    if (typeof stateToPropMapping !== 'object') {
      throw me(ERR.CC_CLASS_STATE_TO_PROP_MAPPING_INVALID, `ccClassKey:${ccClassKey}`);
    }

    const module_mapAllStateToProp_ = {};
    const module_sharedKey_ = {};
    const module_prefixedKeys_ = {};
    const prefixedKeys = Object.keys(stateToPropMapping);
    const len = prefixedKeys.length;
    for (let i = 0; i < len; i++) {
      const prefixedKey = prefixedKeys[i];
      if (!util.isPrefixedKeyValid(prefixedKey)) {
        throw me(ERR.CC_CLASS_KEY_OF_STATE_TO_PROP_MAPPING_INVALID, `ccClassKey:${ccClassKey}, key:${prefixedKey}`);
      }
      const [targetModule, targetKey] = prefixedKey.split('/');
      if (module_mapAllStateToProp_[targetModule] === true) {
        // ignore other keys...
      } else {
        if (targetKey === '*') {
          module_mapAllStateToProp_[targetModule] = true;
          module_sharedKey_[targetModule] = prefixedKey;
        } else {
          const modulePrefixedKeys = util.safeGetArrayFromObject(module_prefixedKeys_, targetModule);
          modulePrefixedKeys.push(prefixedKey);
          module_mapAllStateToProp_[targetModule] = false;
        }
      }
    }

    const targetModules = Object.keys(module_mapAllStateToProp_);
    const propKey_appeared_ = {};//help cc to judge propKey is duplicated or not
    targetModules.forEach(module => {
      const moduleState = _state[module];
      if (moduleState === undefined) {
        throw me(ERR.CC_MODULE_NOT_FOUND, vbi(`module:${module}, check your stateToPropMapping config!`))
      }

      let isPropStateSet = false;

      if (module_mapAllStateToProp_[module] === true) {
        const moduleStateKeys = Object.keys(moduleState);
        moduleStateKeys.forEach(msKey => {
          // now prop key equal state key if user declare key like m1/* in stateToPropMapping;
          const { moduledPropKey, originalPropKey, derivedPropKey } = _getPropKeyPair(isPropStateModuleMode, module, msKey, '');
          const appeared = propKey_appeared_[moduledPropKey];

          if (appeared === true) {
            _throwPropDuplicateError(module_sharedKey_[module], module);
          } else {
            propKey_appeared_[moduledPropKey] = true;
            // in this situation , moduledPropKey and moduledStateKey are equal
            propKey_stateKeyDescriptor_[moduledPropKey] = { module, originalStateKey: msKey, moduledStateKey: moduledPropKey };
            stateKey_propKeyDescriptor_[moduledPropKey] = { module, originalStateKey: msKey, moduledPropKey, originalPropKey, derivedPropKey };

            setPropState(propState, derivedPropKey, moduleState[msKey], isPropStateModuleMode, module);
            isPropStateSet = true;
          }
        });
      } else {
        const prefixedKeys = module_prefixedKeys_[module];
        prefixedKeys.forEach(prefixedKey => {
          const [stateModule, stateKey] = prefixedKey.split('/');
          const propKey = stateToPropMapping[prefixedKey];

          const { moduledPropKey, originalPropKey, derivedPropKey } = _getPropKeyPair(isPropStateModuleMode, module, stateKey, propKey);

          const appeared = propKey_appeared_[moduledPropKey];
          if (appeared === true) {
            _throwPropDuplicateError(prefixedKey, module);
          } else {
            propKey_appeared_[moduledPropKey] = true;
            const moduledStateKey = `${module}/${stateKey}`;
            // stateKey_propKeyDescriptor_ map's key must be moduledStateKey like 'foo/key', cause different module may include the same state key
            propKey_stateKeyDescriptor_[moduledPropKey] = { module: stateModule, originalStateKey: stateKey, moduledStateKey };
            stateKey_propKeyDescriptor_[moduledStateKey] = { module: stateModule,  originalStateKey: stateKey, moduledPropKey, originalPropKey, derivedPropKey };

            setPropState(propState, derivedPropKey, moduleState[stateKey], isPropStateModuleMode, module);
            isPropStateSet = true;
          }
        });
      }

      if (isPropStateSet === true) {
        const pCcClassKeys = util.safeGetArrayFromObject(propModuleName_ccClassKeys_, module);
        if (!pCcClassKeys.includes(ccClassKey)) pCcClassKeys.push(ccClassKey);
      }
    });

    ccClassContext.stateToPropMapping = stateToPropMapping;
    ccClassContext.isPropStateModuleMode = isPropStateModuleMode;
  }

  contextMap[ccClassKey] = ccClassContext;
}