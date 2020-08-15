

import * as util from '../../support/util';
import { NOT_A_JSON, STR_ARR_OR_STAR } from '../../support/priv-constant';
import { ERR, MODULE_GLOBAL } from '../../support/constant';
import ccContext from '../../cc-context';

const { isModuleNameCcLike, isModuleNameValid, verboseInfo: vbi, makeError, okeys } = util;
const { store, getModuleStateKeys } = ccContext

/** 检查模块名，名字合法，就算检查通过 */
export function checkModuleNameBasically(moduleName) {
  if (!isModuleNameValid(moduleName)) {
    throw new Error(`module[${moduleName}] writing is invalid!`);
  }
  if (isModuleNameCcLike(moduleName)) {
    throw new Error(`'$$cc' is a built-in module name for concent`);
  }
}

/**
 * 检查模块名, moduleMustNotExisted 默认为true，
 * true表示【module名字合法】且【对应的moduleState不存在】，才算检查通过  
 * false表示【module名字合法】且【对应的moduleState存在】，才算检查通过
 * @param {string} moduleName 
 * @param {boolean} [moduleMustNotExisted=true] - true 要求模块应该不存在 ,false 要求模块状态应该已存在
 */
export function checkModuleName(moduleName, moduleMustNotExisted = true, vbiMsg = '') {
  const _vbiMsg = vbiMsg || `module[${moduleName}]`
  const _state = store._state;
  checkModuleNameBasically(moduleName);
  if (moduleName !== MODULE_GLOBAL) {
    if (moduleMustNotExisted) {
      if (util.isObjectNotNull(_state[moduleName])) {//但是却存在了
        throw makeError(ERR.CC_MODULE_NAME_DUPLICATE, vbi(_vbiMsg));
      }
    } else {
      if (!_state[moduleName]) {//实际上却不存在
        throw makeError(ERR.CC_MODULE_NOT_FOUND, vbi(_vbiMsg));
      }
    }
  }
}

export function checkModuleNameAndState(moduleName, moduleState, moduleMustNotExisted) {
  checkModuleName(moduleName, moduleMustNotExisted);
  if (!util.isPJO(moduleState)) {
    throw new Error(`module[${moduleName}]'s state ${NOT_A_JSON}`);
  }
}

export function checkStoredKeys(belongModule, storedKeys) {
  if (storedKeys === '*') {
    return;
  }
  if (Array.isArray(storedKeys)) {
    checkKeys(belongModule, storedKeys, false, 'storedKeys invalid ');
    return;
  }
  throw new Error(`storedKeys type err, ${STR_ARR_OR_STAR}`)
}

export function checkKeys(module, keys, keyShouldBeModuleStateKey = true, extraInfo = '') {
  const keyword = keyShouldBeModuleStateKey ? '' : 'not ';
  const keyTip = (name, keyword) => `${extraInfo}key[${name}] must ${keyword}be a module state key`;

  const moduleStateKeys = getModuleStateKeys(module);
  keys.forEach(sKey => {
    const keyInModuleState = moduleStateKeys.includes(sKey);
    const throwErr = () => { throw new Error(keyTip(sKey, keyword)) };

    if (keyShouldBeModuleStateKey) {
      (!keyInModuleState) && throwErr();
    } else {
      keyInModuleState && throwErr();
    }
  });
}

export function checkConnectSpec(connectSpec) {
  const invalidConnect = `param connect is invalid,`;
  const invalidConnectItem = m => `${invalidConnect} module[${m}]'s value ${STR_ARR_OR_STAR}`;

  okeys(connectSpec).forEach(m => {
    checkModuleName(m, false);
    const val = connectSpec[m];
    if (typeof val === 'string') {
      if (val !== '*' && val !== '-') throw new Error(invalidConnectItem(m));
    } else if (!Array.isArray(val)) {
      throw new Error(invalidConnectItem(m));
    } else {
      checkKeys(m, val, true, `connect module[${m}] invalid,`);
    }
  });
}

export function checkRenderKeyClasses(regRenderKeyClasses) {
  if (!Array.isArray(regRenderKeyClasses) && regRenderKeyClasses !== '*') {
    throw new Error(`renderKeyClasses type err, it ${STR_ARR_OR_STAR}`);
  }
}
