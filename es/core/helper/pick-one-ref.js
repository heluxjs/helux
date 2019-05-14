import ccContext from '../../cc-context';
import cst from '../../support/constant';

/****
 * pick one ccInstance ref randomly
 */
export default function (module, excludeDispatcher = true) {
  const { ccKey_ref_, moduleName_ccClassKeys_, ccClassKey_ccClassContext_ } = ccContext;

  let ccKeys = [];
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
  }

  if (ccKeys.length === 0) {
    ccKeys = Object.keys(ccKey_ref_);
  }

  if (ccKeys.length === 0) {
    const ignoreIt = `if this message doesn't matter, you can ignore it`;
    if (module) throw new Error(`[[pick-one-ref]]: no any ccInstance founded for module:${module}!,${ignoreIt}`);
    else throw new Error(`[[pick-one-ref]]: no any ccInstance founded currently,${ignoreIt}`);
  }

  if (excludeDispatcher === true) {
    ccKeys = ccKeys.filter(key => key != cst.CC_DISPATCHER);
  }

  const oneRef = ccKey_ref_[ccKeys[0]];

  if (!oneRef) {
    throw new Error('cc found no ref!');
  }
  return oneRef;
}