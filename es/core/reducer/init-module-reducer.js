import ccContext from '../../cc-context';
import * as checker from '../checker';
import * as util from '../../support/util';
import dispatch from '../../api/dispatch';
import lazyDispatch from '../../api/lazy-dispatch';

export default function(module, reducer, rootReducerCanNotContainInputModule = true) {
  if (!reducer) return;
  if (rootReducerCanNotContainInputModule) checker.checkReducerModuleName(module);
  else checker.checkModuleNameBasically(module);

  const { _reducer, _reducerCaller, _lazyReducerCaller, _reducerName_FullReducerNameList_, _reducerModule_fnNames_ } = ccContext.reducer;
  _reducer[module] = reducer;
  const subReducerCaller = util.safeGetObjectFromObject(_reducerCaller, module);
  const subLazyReducerCaller = util.safeGetObjectFromObject(_lazyReducerCaller, module);
  const fnNames = util.safeGetArrayFromObject(_reducerModule_fnNames_, module);

  const reducerNames = util.okeys(reducer);
  reducerNames.forEach(name => {
    fnNames.push(name);
    subReducerCaller[name] = (payload, delay, idt) => dispatch(`${module}/${name}`, payload, delay, idt);
    subLazyReducerCaller[name] = (payload, delay, idt) => lazyDispatch(`${module}/${name}`, payload, delay, idt);

    const reducerFn = reducer[name];
    if(typeof reducerFn !== 'function'){
      throw new Error(`reducer key[${name}] 's value is not a function`);
    }else{
      reducerFn.__fnName = name;//!!! 很重要，将真正的名字附记录上，否则名字是编译后的缩写名
    }
    // 给函数绑上模块名，方便dispatch可以直接调用函数时，也能知道是更新哪个模块的数据，
    // 暂不考虑，因为cloneModule怎么处理，因为它们指向的是用一个函数
    // reducerFn.stateModule = module;

    const list = util.safeGetArrayFromObject(_reducerName_FullReducerNameList_, name);
    list.push(`${module}/${name}`);
  });
}