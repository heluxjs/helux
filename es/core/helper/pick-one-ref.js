import ccContext from '../../cc-context';
import { CC_DISPATCHER, MODULE_DEFAULT, CC_FRAGMENT_PREFIX } from '../../support/constant';

/****
 * pick one ccInstance ref randomly
 */
export default function (module, mustBelongToModule = false) {
  const { ccKey_ref_, moduleName_ccClassKeys_, ccClassKey_ccClassContext_ } = ccContext;

  let ccKeys = [];
  if (module === MODULE_DEFAULT) {

  }
  if (module) {
    if (ccContext.store._state[module]) {
      const ccClassKeys = moduleName_ccClassKeys_[module];
      if (ccClassKeys && ccClassKeys.length !== 0) {
        const oneCcClassKey = ccClassKeys[0];
        const ccClassContext = ccClassKey_ccClassContext_[oneCcClassKey];
        if (!ccClassContext) {
          throw new Error(`no ccClassContext found for ccClassKey ${oneCcClassKey}!`);
        }
        ccKeys = ccClassContext.ccKeys;
      } else {
        // find one cc ref later
      }
    } else {
      throw new Error(`sorry, module: ${module} is invalid, cc don't know this module!`);
    }

    ccKeys = ccKeys.filter(key => !key.startsWith(CC_FRAGMENT_PREFIX));
    if (ccKeys.length === 0) {
      if (mustBelongToModule === false) ccKeys = [CC_DISPATCHER];
      else{
        const ignoreIt = `if this message doesn't matter, you can ignore it`;
        throw new Error(`[[pick-one-ref]]: no any ccInstance founded for module:${module}!,${ignoreIt}`);
      }
    }
  } else {
    ccKeys = [CC_DISPATCHER];
  }

  const oneRef = ccKey_ref_[ccKeys[0]];

  if (!oneRef) {
    throw new Error('cc found no ref!');
  }
  return oneRef;
}