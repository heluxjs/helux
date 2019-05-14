import util from '../../support/util';
import { ERR } from '../../support/constant';

export default function (moduleState, moduleName) {
  if (!util.isModuleStateValid(moduleState)) {
    throw util.makeError(ERR.CC_STORE_STATE_INVALID, util.verboseInfo(`moduleName:${moduleName}'s state is invalid!`));
  }
}
