import { isModuleNameCcLike, isModuleNameValid, verboseInfo, makeError } from '../../support/util';
import { ERR, MODULE_GLOBAL } from '../../support/constant';
import ccContext from '../../cc-context';

export default function (moduleName, checkReducerConfig = false) {
  const _state = ccContext.store._state;
  const _reducer = ccContext.reducer._reducer;
  if (!isModuleNameValid(moduleName)) {
    throw makeError(ERR.CC_MODULE_NAME_INVALID, verboseInfo(` module[${moduleName}] is invalid!`));
  }
  if (isModuleNameCcLike(moduleName)) {
    throw makeError(ERR.CC_MODULE_KEY_CC_FOUND);
  }

  if (moduleName !== MODULE_GLOBAL) {
    if (checkReducerConfig) {
      if (_reducer[moduleName]) {
        throw makeError(ERR.CC_REDUCER_MODULE_NAME_DUPLICATE, verboseInfo(`module[${moduleName}]`));
      }
    } else {
      if (_state[moduleName]) {
        throw makeError(ERR.CC_MODULE_NAME_DUPLICATE, verboseInfo(`module[${moduleName}]`));
      }
    }
  }
}
