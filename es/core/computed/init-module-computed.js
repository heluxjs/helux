import ccContext from '../../cc-context';
import * as checker from '../checker';
import * as util from '../../support/util';
var safeGetObjectFromObject = util.safeGetObjectFromObject,
    isPlainJsonObject = util.isPlainJsonObject;
export default function (module, computed) {
  if (!isPlainJsonObject(computed)) {
    throw new Error("StartUpOption.computed." + module + "'s value is not a plain json object!");
  }

  checker.checkModuleName(module, false, "computed." + module + " is invalid");
  var rootState = ccContext.store.getState();
  var rootComputedValue = ccContext.computed.getRootComputedValue();
  var rootComputedFn = ccContext.computed.getRootComputedFn();
  var moduleState = rootState[module];
  var stateKeys = Object.keys(computed);
  stateKeys.forEach(function (key) {
    var originalValue = moduleState[key];

    if (originalValue !== undefined) {
      var moduleComputedFn = safeGetObjectFromObject(rootComputedFn, module);
      var fn = computed[key];
      moduleComputedFn[key] = fn;
      var computedValue = fn(originalValue, originalValue, moduleState);
      var moduleComputedValue = safeGetObjectFromObject(rootComputedValue, module);
      moduleComputedValue[key] = computedValue;
    } else {
      //strict?
      justWarning("computed." + module + "'s key[" + key + "] is not declared in store." + module + "'s state!");
    }
  });
}