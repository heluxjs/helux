import { isModuleNameCcLike, isModuleNameValid, verboseInfo, makeError } from '../../support/util';
import { ERR, MODULE_GLOBAL } from '../../support/constant';
import ccContext from '../../cc-context';

export default function (moduleName, checkForReducer = false) {
  const _state = ccContext.store._state;
  const _reducer = ccContext.reducer._reducer;
  if (!isModuleNameValid(moduleName)) {
    throw makeError(ERR.CC_MODULE_NAME_INVALID, verboseInfo(` moduleName:${moduleName} is invalid!`));
  }
  if (isModuleNameCcLike(moduleName)) {
    throw makeError(ERR.CC_MODULE_KEY_CC_FOUND);
  }
  if (checkForReducer) {
    if (moduleName != MODULE_GLOBAL) {
      if (_reducer[moduleName]) {
        throw makeError(ERR.CC_REDUCER_MODULE_NAME_DUPLICATE, verboseInfo(`moduleName:${moduleName}`));
      }
    }
  } else {
    if (_state[moduleName]) {
      throw makeError(ERR.CC_MODULE_NAME_DUPLICATE, verboseInfo(`moduleName:${moduleName}`));
    }
  }
}
