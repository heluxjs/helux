

import * as util from '../../support/util';
import { NOT_A_JSON } from '../../support/priv-constant';
import { ERR, MODULE_GLOBAL } from '../../support/constant';
import ccContext from '../../cc-context';

const { isModuleNameCcLike, isModuleNameValid, verboseInfo: vbi, makeError } = util;

/** 检查模块名，名字合法，就算检查通过 */
export function checkModuleNameBasically(moduleName) {
  if (!isModuleNameValid(moduleName)) {
    throw new Error(`module[${moduleName}] writing is invalid!`);
  }
  if (isModuleNameCcLike(moduleName)) {
    throw new Error(`'$$cc' is a built-in module name for concent`);
  }
}

export function checkReducerModuleName(moduleName) {
  const _reducer = ccContext.reducer._reducer;
  checkModuleNameBasically(moduleName);
  if (moduleName !== MODULE_GLOBAL) {
    if (_reducer[moduleName]) {
      throw makeError(ERR.CC_REDUCER_MODULE_NAME_DUPLICATE, vbi(`module[${moduleName}]`));
    }
  }
}

/**
 * 检查模块名, moduleMustNotExisted 默认为true，表示【module名字合法】且【对应的moduleState不存在】，才算检查通过  
 * 如果设置为false，表示【module名字合法】且【对应的moduleState存在】，才算检查通过
 * @param {string} moduleName 
 * @param {boolean} moduleMustNotExisted 
 */
export function checkModuleName(moduleName, moduleMustNotExisted = true, vbiMsg = '') {
  const _vbiMsg = vbiMsg || `module[${moduleName}]`
  const _state = ccContext.store._state;
  checkModuleNameBasically(moduleName);
  if (moduleName !== MODULE_GLOBAL) {
    if (moduleMustNotExisted === true) {//要求模块应该不存在
      if (util.isObjectNotNull(_state[moduleName])) {//但是却存在了
        throw makeError(ERR.CC_MODULE_NAME_DUPLICATE, vbi(_vbiMsg));
      }
    } else {//要求模块状态应该已存在
      if (!_state[moduleName]) {//实际上却不存在
        throw makeError(ERR.CC_MODULE_NOT_FOUND, vbi(_vbiMsg));
      }
    }
  }
}

export function checkModuleNameAndState(moduleName, moduleState, moduleMustNotExisted) {
  checkModuleName(moduleName, moduleMustNotExisted);
  if(!util.isPlainJsonObject(moduleState)){
    throw new Error(`module[${moduleName}]'s state ${NOT_A_JSON}`);
  }
}

export function checkStoredKeys(moduleStateKeys, storedKeys) {
  const isSKeysArr = Array.isArray(storedKeys);
  if (!isSKeysArr && storedKeys !== '*') {
    throw new Error(`storedKeys type err, it is must be an array or string *`)
  }

  if (isSKeysArr) {
    storedKeys.forEach(sKey => {
      if (moduleStateKeys.includes(sKey)) {
        throw new Error(`storedKeys key err, the key[${sKey}] can not be a module state key!`)
      }
    });
  }
}