import { MODULE_GLOBAL, MODULE_CC, MODULE_VOID, MODULE_DEFAULT } from '../support/constant';

const getRootState = () => ({
  [MODULE_CC]: {},
  [MODULE_VOID]: {},
  [MODULE_GLOBAL]: {},
  [MODULE_DEFAULT]: {},
})

export const _state = getRootState();

export const _prevState = getRootState();

export const reducer = {
  _reducer: {
    [MODULE_GLOBAL]: {
    },
    [MODULE_CC]: {
    }
  },
  _caller: {},
  // _reducerRefCaller: {},//为实例准备的reducer caller
  _fnName2fullFnNames: {},
  _module2fnNames: {},
  _module2Ghosts: {},
};

export const refs = {};

/** @type {{value: import('../types-inner').IRef | null}} */
export const permanentDispatcherRef = { value: null };

/**
 * 为避免cc-context文件里调用的方法和自身产生循环引用，将moduleName_stateKeys_单独拆开放置到此文件
 * 如果还有别的类似循环引用产生，都可以像moduleName_stateKeys_一样单独拆出来放置为一个文件
 */
export const moduleName2stateKeys = {
  [MODULE_DEFAULT]: [],
};

