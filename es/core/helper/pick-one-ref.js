import ccContext from '../../cc-context';
import { CC_DISPATCHER, MODULE_DEFAULT, CC_FRAGMENT_PREFIX } from '../../support/constant';
/****
 * pick one ccInstance ref randomly
 */

export default function (module, mustBelongToModule) {
  if (mustBelongToModule === void 0) {
    mustBelongToModule = false;
  }

  var ccKey_ref_ = ccContext.ccKey_ref_,
      moduleName_ccClassKeys_ = ccContext.moduleName_ccClassKeys_,
      ccClassKey_ccClassContext_ = ccContext.ccClassKey_ccClassContext_;
  var ccKeys = [];

  if (module === MODULE_DEFAULT) {}

  if (module) {
    if (ccContext.store._state[module]) {
      var ccClassKeys = moduleName_ccClassKeys_[module];

      if (ccClassKeys && ccClassKeys.length !== 0) {
        var oneCcClassKey = ccClassKeys[0];
        var ccClassContext = ccClassKey_ccClassContext_[oneCcClassKey];

        if (!ccClassContext) {
          throw new Error("no ccClassContext found for ccClassKey " + oneCcClassKey + "!");
        }

        ccKeys = ccClassContext.ccKeys;
      } else {// find one cc ref later
      }
    } else {
      throw new Error("sorry, module: " + module + " is invalid, cc don't know this module!");
    }

    ccKeys = ccKeys.filter(function (key) {
      return !key.startsWith(CC_FRAGMENT_PREFIX);
    });

    if (ccKeys.length === 0) {
      if (mustBelongToModule === false) ccKeys = [CC_DISPATCHER];else {
        var ignoreIt = "if this message doesn't matter, you can ignore it";
        throw new Error("[[pick-one-ref]]: no any ccInstance founded for module:" + module + "!," + ignoreIt);
      }
    }
  } else {
    ccKeys = [CC_DISPATCHER];
  }

  var oneRef = ccKey_ref_[ccKeys[0]];

  if (!oneRef) {
    throw new Error('cc found no ref!');
  }

  return oneRef;
}