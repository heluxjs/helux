import ccContext from '../../cc-context';
import { CC_PREFIX, MODULE_DEFAULT, CC_DISPATCHER, ERR } from '../../support/constant';
import * as util from '../../support/util';

const { isObjectNull, makeError:me } = util
const { featureStr2classKey, userClassKey2featureStr, ccClassKey2Context } = ccContext;

let cursor = 0;

export default function (allowNamingDispatcher, module, connect, prefix, featureStr, classKey = '') {
  // 未指定classKey
  if (!classKey) {
    // 未指定所属模块，也未连接到其他模块
    if (module === MODULE_DEFAULT && isObjectNull(connect)) {
      return `${prefix}0`;
    }

    const prefixedFeatureStr = `${prefix}:${featureStr}`;
    let _classKey = featureStr2classKey[prefixedFeatureStr];
    if (_classKey) {
      return _classKey;
    }

    cursor++;
    _classKey = `${prefix}${cursor}`;
    featureStr2classKey[prefixedFeatureStr] = _classKey;
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

  const clsCtx = ccClassKey2Context[classKey];
  if (clsCtx) {
    const fStr = userClassKey2featureStr[classKey];
    if (fStr !== featureStr) {
      //不允许，特征值不一样的class指定相同的ccClassKey
      throw me(ERR.CC_CLASS_KEY_DUPLICATE, `ccClassKey:[${classKey}] duplicate`);
    }
  } else {
    userClassKey2featureStr[classKey] = featureStr;
  }

  return classKey;
}
