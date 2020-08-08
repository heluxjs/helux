/** @typedef {import('../../types').ICtxBase} ICtxBase */
import ccContext from '../../cc-context';
import { okeys } from '../../support/util';
import { checkModuleName } from '../param/checker';

const ignoreIt = `if this message doesn't matter, you can ignore it`;

/****
 * 尽可能优先找module的实例，找不到的话在根据mustBelongToModule值来决定要不要找其他模块的实例
 * pick one ccInstance ref randomly
 */
export default function (module, mustBelongToModule = false) {
  const { ccUKey_ref_ } = ccContext;

  let oneRef = null;
  if (module) {
    checkModuleName(module, false);
    const ukeys = okeys(ccUKey_ref_);
    const len = ukeys.length;
    for (let i = 0; i < len; i++) {
      /** @type {{ctx:ICtxBase}} */
      const ref = ukeys[i];
      if (ref.ctx.module === module) {
        oneRef = ref;
        break;
      }
    }
  }

  if (!oneRef) {
    if (mustBelongToModule) {
      throw new Error(`[[pickOneRef]]: no ref found for module[${module}]!,${ignoreIt}`);
    } else {
      oneRef = ccContext.permanentDispatcher;
    }
  }

  return oneRef;
}
