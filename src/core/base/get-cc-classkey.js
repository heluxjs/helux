import ccContext from '../../cc-context';
import { CC_PREFIX, MODULE_DEFAULT, CC_DISPATCHER, ERR } from '../../support/constant';
import * as util from '../../support/util';

const { isObjectNull, makeError:me } = util
const { featureStr_classKey_, userClassKey_featureStr_, ccClassKey_ccClassContext_ } = ccContext;

let cursor = 0;

export default function (allowNamingDispatcher, module, connect, watchedKeys, prefix, featureStr, classKey = '') {
  // 未指定classKey
  if (!classKey) {
    // 未指定所属模块，也未连接到其他模块，且无watchedKeys
    if (module === MODULE_DEFAULT && isObjectNull(connect) && watchedKeys.length === 0) {
      return `${prefix}0`;
    }

    const prefixedFeatureStr = `${prefix}:${featureStr}`;
    let _classKey = featureStr_classKey_[prefixedFeatureStr];
    if (_classKey) {
      return _classKey;
    }

    cursor++;
    _classKey = `${prefix}${cursor}`;
    featureStr_classKey_[prefixedFeatureStr] = _classKey;
    return _classKey;
  }

  // verify user input classKey
  if (classKey.startsWith(CC_PREFIX)) {
    throw new Error(`user can not specify a classKey[${classKey}] starts with $$Cc`);
  }

  if (!allowNamingDispatcher) {
    if (classKey.toLowerCase() === CC_DISPATCHER.toLowerCase()) {
      // throw new Error(`${CC_DISPATCHER} is cc built-in ccClassKey name, if you want to customize your dispatcher, 
      // you can set autoCreateDispatcher=false in StartupOption, and use createDispatcher then.`)
      // currently createDispatcher is not allowed..
      throw new Error(`${CC_DISPATCHER} is cc built-in ccClassKey name.`)
    }
  }

  const ctx = ccClassKey_ccClassContext_[classKey];
  if (ctx) {
    const fStr = userClassKey_featureStr_[classKey];
    if (fStr !== featureStr) {
      //不允许，特征值不一样的class指定相同的ccClassKey
      throw me(ERR.CC_CLASS_KEY_DUPLICATE, `ccClassKey:[${classKey}] duplicate`);
    }
  } else {
    userClassKey_featureStr_[classKey] = featureStr;
  }

  return classKey;
}