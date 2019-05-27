import ccContext from '../../cc-context';
import * as checker from '../checker';
export default function (module, reducer, rootReducerCanNotContainInputModule) {
  if (rootReducerCanNotContainInputModule === void 0) {
    rootReducerCanNotContainInputModule = true;
  }

  if (!reducer) return;
  if (rootReducerCanNotContainInputModule) checker.checkReducerModuleName(module);else checker.checkModuleNameBasically(module);
  var _reducer = ccContext.reducer._reducer;
  _reducer[module] = reducer;
}