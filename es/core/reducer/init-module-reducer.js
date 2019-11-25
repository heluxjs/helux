import ccContext from '../../cc-context';
import * as checker from '../checker';
import * as util from '../../support/util';
import dispatch from '../../api/dispatch';
import lazyDispatch from '../../api/lazy-dispatch';
import guessDuplicate from '../base/guess-duplicate';

export default function(module, reducer, rootReducerCanNotContainInputModule = true, tag) {
  if (!reducer) return;

  try{
    if (rootReducerCanNotContainInputModule) checker.checkReducerModuleName(module);
    else checker.checkModuleNameBasically(module);
  }catch(err){
    guessDuplicate(err, module, 'reducer');
  }
  

  const {
    _reducer, _reducerCaller, _lazyReducerCaller, _reducerFnName_fullFnNames_, _reducerModule_fnNames_,
    // _reducerRefCaller, _lazyReducerRefCaller,
  } = ccContext.reducer;
  _reducer[module] = reducer;
  const subReducerCaller = util.safeGetObjectFromObject(_reducerCaller, module);
  const subLazyReducerCaller = util.safeGetObjectFromObject(_lazyReducerCaller, module);
  // const subReducerRefCaller = util.safeGetObjectFromObject(_reducerRefCaller, module);
  // const subLazyReducerRefCaller = util.safeGetObjectFromObject(_lazyReducerRefCaller, module);

  const fnNames = util.safeGetArrayFromObject(_reducerModule_fnNames_, module);

  // 自动附加一个setState在reducer里
  if (!reducer.setState) reducer.setState = payload => payload;

  const reducerNames = util.okeys(reducer);
  reducerNames.forEach(name => {
    // avoid hot reload
    if (!fnNames.includes(name)) fnNames.push(name);
    let fullFnName = `${module}/${name}`;

    subReducerCaller[name] = (payload, renderKey, delay) => dispatch(fullFnName, payload, renderKey, delay);
    subLazyReducerCaller[name] = (payload, renderKey, delay) => lazyDispatch(fullFnName, payload, renderKey, delay);

    // function wrappedReducerFn(payload, delay, idt){
    // }
    // subReducerRefCaller[name] = wrappedReducerFn;
    // function wrappedLazyReducerFn(payload, delay, idt) {
    // }
    // subLazyReducerRefCaller[name] = wrappedLazyReducerFn;

    const reducerFn = reducer[name];
    if(typeof reducerFn !== 'function'){
      throw new Error(`reducer key[${name}] 's value is not a function`);
    }else{
      reducerFn.__fnName = name;//!!! 很重要，将真正的名字附记录上，否则名字是编译后的缩写名
      reducerFn.__stateModule = module;
      reducerFn.__reducerModule = module;
    }
    // 给函数绑上模块名，方便dispatch可以直接调用函数时，也能知道是更新哪个模块的数据，
    // 暂不考虑，因为cloneModule怎么处理，因为它们指向的是用一个函数
    // reducerFn.stateModule = module;

    const list = util.safeGetArrayFromObject(_reducerFnName_fullFnNames_, name);
    // avoid hot reload
    if (!list.includes(fullFnName)) list.push(fullFnName);
  });
}