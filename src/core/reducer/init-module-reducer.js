import ccContext from '../../cc-context';
import * as checker from '../checker';
import * as util from '../../support/util';
import dispatch from '../../api/dispatch';
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
    _reducer, _reducerCaller, _reducerFnName_fullFnNames_, _reducerModule_fnNames_,
    // _reducerRefCaller, _lazyReducerRefCaller,
  } = ccContext.reducer;

  // 防止同一个reducer被载入到不同模块时，setState附加逻辑不正确
  const newReducer = Object.assign({}, reducer);
  _reducer[module] = newReducer;
  
  const subReducerCaller = util.safeGetObjectFromObject(_reducerCaller, module);
  // const subReducerRefCaller = util.safeGetObjectFromObject(_reducerRefCaller, module);

  const fnNames = util.safeGetArrayFromObject(_reducerModule_fnNames_, module);

  // 自动附加一个setState在reducer里
  if (!newReducer.setState) newReducer.setState = payload => payload;

  const reducerNames = util.okeys(newReducer);
  reducerNames.forEach(name => {
    // avoid hot reload
    if (!fnNames.includes(name)) fnNames.push(name);
    let fullFnName = `${module}/${name}`;

    subReducerCaller[name] = (payload, renderKeyOrOptions, delay) => dispatch(fullFnName, payload, renderKeyOrOptions, delay);

    // function wrappedReducerFn(payload, delay, idt){
    // }
    // subReducerRefCaller[name] = wrappedReducerFn;

    const reducerFn = newReducer[name];
    if (typeof reducerFn !== 'function') {
      throw new Error(`reducer key[${name}] 's value is not a function`);
    } else {
      let targetFn = reducerFn;
      if (reducerFn.__fnName) {// 将某个已载入到模块a的reducer再次载入到模块b
        targetFn = (payload, moduleState, actionCtx) => reducerFn(payload, moduleState, actionCtx);
        newReducer[name] = targetFn;
      }

      targetFn.__fnName = name;//!!! 很重要，将真正的名字附记录上，否则名字是编译后的缩写名
      targetFn.__stateModule = module;
      targetFn.__reducerModule = module;
      // AsyncFunction GeneratorFunction Function
      targetFn.__ctName = reducerFn.__ctName || reducerFn.constructor.name;
    }
    // 给函数绑上模块名，方便dispatch可以直接调用函数时，也能知道是更新哪个模块的数据，
    // 暂不考虑，因为cloneModule怎么处理，因为它们指向的是用一个函数
    // reducerFn.stateModule = module;

    const list = util.safeGetArrayFromObject(_reducerFnName_fullFnNames_, name);
    // avoid hot reload
    if (!list.includes(fullFnName)) list.push(fullFnName);
  });
}