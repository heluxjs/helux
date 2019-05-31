import ccContext from '../../cc-context';
import * as checker from '../checker';
import * as util from '../../support/util';

export default function(module, reducer, rootReducerCanNotContainInputModule = true) {
  if (!reducer) return;
  if (rootReducerCanNotContainInputModule) checker.checkReducerModuleName(module);
  else checker.checkModuleNameBasically(module);

  const { _reducer, _reducerName_FullReducerNameList_ } = ccContext.reducer;
  _reducer[module] = reducer;

  const reducerNames = util.okeys(reducer);
  reducerNames.forEach(name=>{
    const list = util.safeGetArrayFromObject(_reducerName_FullReducerNameList_, name);
    list.push(`${module}/${name}`);
  });
}