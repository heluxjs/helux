import ccContext from '../../cc-context';
import * as util from '../../support/util';
import { NOT_A_JSON } from '../../support/priv-constant';
import dispatch from '../../api/dispatch';

export default function (module, reducer = {}) {

  if (!util.isPJO(reducer)) {
    throw new Error(`module[${module}] reducer ${NOT_A_JSON}`);
  }

  const {
    _reducer, _caller, _fnName_fullFnNames_, _module_fnNames_,
    // _reducerRefCaller, _lazyReducerRefCaller,
  } = ccContext.reducer;

  // 防止同一个reducer被载入到不同模块时，setState附加逻辑不正确
  const newReducer = Object.assign({}, reducer);
  _reducer[module] = newReducer;

  const subReducerCaller = util.safeGet(_caller, module);
  // const subReducerRefCaller = util.safeGet(_reducerRefCaller, module);

  const fnNames = util.safeGetArray(_module_fnNames_, module);

  // 自动附加一个setState在reducer里
  if (!newReducer.setState) newReducer.setState = payload => payload;

  const reducerFnNames = util.okeys(newReducer);
  reducerFnNames.forEach(name => {
    // avoid hot reload
    if (!fnNames.includes(name)) fnNames.push(name);
    let fullFnName = `${module}/${name}`;
    const list = util.safeGetArray(_fnName_fullFnNames_, name);
    // avoid hot reload
    if (!list.includes(fullFnName)) list.push(fullFnName);

    subReducerCaller[name] = (payload, renderKeyOrOptions, delay) => dispatch(fullFnName, payload, renderKeyOrOptions, delay);

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
      // AsyncFunction GeneratorFunction Function
      targetFn.__ctName = reducerFn.__ctName || reducerFn.constructor.name;
      targetFn.__isAsync = util.isAsyncFn(reducerFn);
    }
    // 给函数绑上模块名，方便dispatch可以直接调用函数时，也能知道是更新哪个模块的数据，
    // 暂不考虑，因为cloneModule怎么处理，因为它们指向的是用一个函数
    // reducerFn.stateModule = module;

  });
}
