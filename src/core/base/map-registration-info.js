import ccContext from '../../cc-context';
import getFeatureStr from './get-feature-str';
import getCcClassKey from '../param/get-cc-classkey';
import getRenderKeyClasses from '../param/get-rdkey-classes';
import * as checker from '../param/checker';
import * as ex from '../param/extractor';
import * as util from '../../support/util';
import { MODULE_DEFAULT } from '../../support/constant';

const {
  ccClassKey2Context,
} = ccContext;

function checkCcStartupOrNot() {
  if (ccContext.isStartup !== true) {
    throw new Error('you must call run api to startup concent before register Class!');
  }
}

/**
 * map registration info to ccContext
 */
function mapRegInfo(
  module = MODULE_DEFAULT, ccClassKey, regRenderKeyClasses, classKeyPrefix, regWatchedKeys,
  regConnect, __checkStartUp, __calledBy
) {
  if (__checkStartUp === true) checkCcStartupOrNot();
  const allowNamingDispatcher = __calledBy === 'cc';
  const renderKeyClasses = regRenderKeyClasses || [];

  checker.checkModuleName(module, false, `module[${module}] not configured`);
  checker.checkRenderKeyClasses(renderKeyClasses);

  const _connect = ex.getConnect(regConnect);
  const _watchedKeys = ex.getWatchedStateKeys(module, ccClassKey, regWatchedKeys);
  // 注意此处用户不指定renderKeyClasses时，算出来的特征值和renderKeyClasses无关
  const featureStr = getFeatureStr(module, _connect, renderKeyClasses);
  const _ccClassKey = getCcClassKey(allowNamingDispatcher, module, _connect, classKeyPrefix, featureStr, ccClassKey);

  // 此处再次获得真正的renderKeyClasses
  const _renderKeyClasses = getRenderKeyClasses(_ccClassKey, regRenderKeyClasses);
  let ccClassContext = ccClassKey2Context[_ccClassKey];
  //做一个判断，有可能是热加载调用
  if (!ccClassContext) {
    ccClassContext = util.makeCcClassContext(module, _ccClassKey, _renderKeyClasses);
    ccClassKey2Context[_ccClassKey] = ccClassContext;
  }

  return { _module: module, _connect, _ccClassKey, _watchedKeys };
}

export default mapRegInfo;
