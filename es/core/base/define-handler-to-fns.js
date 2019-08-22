import { okeys, safeGetObjectFromObject, safeGetArrayFromObject, makeError, verboseInfo } from '../../support/util';
import { ERR } from '../../support/constant';
import ccContext from '../../cc-context';

const { moduleName_stateKeys_ } = ccContext;

/**
  computed({
    'foo/firstName': ()=>{},
    'foo/fullName':{
      fn:()=>{},
      depKeys:['firstName', 'lastName']
    },
    'foo/bala':{
      fn:()=>{},
      depKeys:'*'
    }
  })
-----------------------------------
  computed('foo/firstName', ()=>{});
  computed('foo/fullName', ()=>{}, ['firstName', 'lastName']);
  computed('foo/bala', ()=>{}, '*');


watch({
  'foo/a':{
    fn:()=>{},
    immediate: true,
  },
  'foo/whatever':{
    fn:()=>{},
    immediate: true,
    depKeys:['a', 'b', 'c']
  }
})
-----------------------------------
watch('foo/a', ()=>{}, true);
watch('foo/whatever', ()=>{}, true, ['firstName', 'lastName']);

*/


export default function (refCtx, item, handler, fns, immediateKeys, immediate, depStateKeys, depFn, type) {
  if (!item) return;

  const itype = typeof item;

  if (itype === 'object') {
    parseDescObj(refCtx, item, fns, depFn, immediateKeys, type);
    return;
  }

  if (itype === 'function') {
    const ret = item(refCtx);
    if (!ret) return;

    if (typeof ret === 'object') {
      parseDescObj(refCtx, ret, fns, depFn, immediateKeys, type);
      return;
    }
    throw new Error(`type of computed or watch callback result must be an object.`);
  }

  if (itype === 'string') {
    const key = item;
    if (depStateKeys) {
      mapDepDesc(refCtx, key, depFn, depStateKeys, immediate);
      flagHasFn(refCtx, type);
      return;
    }

    getModuleAndRetKey(refCtx, key);
    fns[key] = handler;
    if (immediate) immediateKeys.push(key);
    flagHasFn(refCtx, type);
    return;
  }
};

function flagHasFn(refCtx, type) {
  if (type === 1) refCtx.hasComputedFn = true;
  else refCtx.hasWatchFn = true;
}

function parseDescObj(refCtx, descObj, fns, depFn, immediateKeys, type) {
  const keys = okeys(descObj);

  if (keys.length > 0) {
    flagHasFn(refCtx, type);

    keys.forEach(key => {
      const val = descObj[key];
      const vType = typeof val;
      if (vType === 'function') {
        fns[key] = val;
        return;
      }

      if (vType === 'object') {
        const { fn, depKeys, immediate } = val;
        if (!depKeys) {
          fns[key] = fn;
          if (immediate && immediateKeys) {
            immediateKeys.push(key);
          }
          return;
        }

        mapDepDesc(refCtx, key, depFn, depKeys, immediate);
      }
    });
  }
}

function mapDepDesc(refCtx, key, depFn, depKeys, immediate) {
  const { module, retKey } = getModuleAndRetKey(refCtx, key, false);

  const moduleDepDesc = safeGetObjectFromObject(depFn, module, { stateKey_retKeys_: {}, retKey_fn_: {}, immediateRetKeys: [] });
  const { stateKey_retKeys_, retKey_fn_ } = moduleDepDesc;

  let _depKeys = depKeys
  if (depKeys === '*') {
    _depKeys = ['*'];
  }
  if (!Array.isArray(_depKeys)) {
    throw new Error(`depKeys can only be an Array<string> or string *`);
  }

  if (immediate) immediateRetKeys.push(immediate);
  retKey_fn_[retKey] = fn;
  _depKeys.forEach(sKey => {
    //一个依赖key列表里的stateKey会对应着多个结果key
    const retKeys = safeGetArrayFromObject(stateKey_retKeys_, sKey);
    retKeys.push(retKey);
  });
}

// retKey作为将计算结果映射到refComputed | refConnectedComputed | moduleComputed 里的key
function getModuleAndRetKey(refCtx, key, mustInclude = true) {
  let _module = refCtx.module, _retKey = key;
  if (key.includes('/')) {
    const [module, retKey] = key.split('/');
    _module = module;
    _retKey = retKey;
  }

  const moduleStateKeys = moduleName_stateKeys_[_module];
  if (!moduleStateKeys) {
    throw makeError(ERR.CC_MODULE_NOT_FOUND, verboseInfo(`module[${_module}]`));
  }

  const includeKey = moduleStateKeys.includes(_retKey);
  if (mustInclude) {
    if (!includeKey) {
      throw new Error(`key[${_retKey}] is not declared in module[${_module}]`);
    }
  } else {
    //传递了depKeys，_retKey不能再是stateKey
    if (includeKey) {
      throw new Error(`retKey[${_retKey}] can not be stateKey of module[${_module}] if you declare depKeys`);
    }
  }

  return { module: _module, retKey: _retKey };
}