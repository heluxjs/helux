import ccContext from '../../cc-context';
import * as checker from '../checker';
import * as util from '../../support/util';
var safeGetObjectFromObject = util.safeGetObjectFromObject,
    isPlainJsonObject = util.isPlainJsonObject;
/**
 * 设置watch值，过滤掉一些无效的key
 */

export default function (module, moduleWatch) {
  if (!isPlainJsonObject(moduleWatch)) {
    throw new Error("StartUpOption.watch." + module + "'s value is not a plain json object!");
  }

  checker.checkModuleName(module, false, "watch." + module + " is invalid");
  var rootWatch = ccContext.watch.getRootWatch();
  var getState = ccContext.store.getState;
  var watchStateKeys = Object.keys(moduleWatch);
  watchStateKeys.forEach(function (key) {
    var moduleState = getState(module);
    var originalValue = moduleState[key];

    if (originalValue !== undefined) {
      var fn = moduleWatch[key];

      if (typeof fn !== 'function') {
        throw new Error("watch." + module + "." + key + "'s value is not a function");
      }

      var ccModuleWatch = safeGetObjectFromObject(rootWatch, module);
      ccModuleWatch[key] = fn;
    } else {
      //strict?
      justWarning("watch." + module + "'s key[" + key + "] is not declared in store." + module + "!");
    }
  });
}