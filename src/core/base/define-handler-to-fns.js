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


export default function (refCtx, item, handler, fns, immediate, depStateKeys, depFn, type) {
  if (!item) return;

  const itype = typeof item;

  if (itype === 'object') {
    parseDescObj(refCtx, item, fns, depFn, type);
    return;
  }

  if (itype === 'function') {
    const ret = item(refCtx);
    if (!ret) return;

    if (typeof ret === 'object') {
      parseDescObj(refCtx, ret, fns, depFn, type);
      return;
    }
    throw new Error(`type of computed or watch callback result must be an object.`);
  }

  if (itype === 'string') {
    const key = item;
    if (depStateKeys) {
      mapDepDesc(refCtx, key, handler, depFn, depStateKeys, immediate, type);
      flagHasFn(refCtx, type);
      return;
    }

    mapNormalDesc(refCtx, fns, key, handler, immediate, type);
  }
};

function mapNormalDesc(refCtx, fns, key, handler, immediate, type) {
  getModuleAndRetKey(refCtx, key);
  fns[key] = handler;
  if (type === 2 && immediate) {
    refCtx.immediateWatchKeys.push(key);
  }
  flagHasFn(refCtx, type);
}

function flagHasFn(refCtx, type) {
  if (type === 1) refCtx.hasComputedFn = true;
  else refCtx.hasWatchFn = true;
}

function parseDescObj(refCtx, descObj, fns, depFn, type) {
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
          //当普通的computed来映射
          mapNormalDesc(refCtx, fns, key, fn, immediate, type);
          return;
        }

        //当依赖型的computed来映射
        mapDepDesc(refCtx, key, fn, depFn, depKeys, immediate, type);
      }
    });
  }
}

function mapDepDesc(refCtx, key, fn, depFn, depKeys, immediate, type) {
  const { module, retKey } = getModuleAndRetKey(refCtx, key, false);

  const moduleDepDesc = safeGetObjectFromObject(depFn, module, { stateKey_retKeys_: {}, retKey_fn_: {} });
  const { stateKey_retKeys_, retKey_fn_ } = moduleDepDesc;

  let _depKeys = depKeys
  if (depKeys === '*') {
    _depKeys = ['*'];
  }
  if (!Array.isArray(_depKeys)) {
    throw new Error(`depKeys can only be an Array<string> or string *`);
  }

  if (type === 2 && immediate) {
    refCtx.immediateWatchKeys.push(key);
  }
  
  retKey_fn_[retKey] = fn;
  _depKeys.forEach(sKey => {
    //一个依赖key列表里的stateKey会对应着多个结果key
    const retKeys = safeGetArrayFromObject(stateKey_retKeys_, sKey);
    retKeys.push(retKey);
  });
}

// retKey作为将计算结果映射到refComputed | refConnectedComputed | moduleComputed 里的key
function getModuleAndRetKey(refCtx, key, mustInclude = true) {
  let _module = refCtx.module, _retKey = key, _stateKeys;
  if (key.includes('/')) {
    const [module, retKey] = key.split('/');
    _module = module;
    _retKey = retKey;
  }

  if (_module === refCtx.module) {
    // 此时computed & watch可能观察的私有的stateKey
    _stateKeys = okeys(refCtx.state);
  } else {
    _stateKeys = moduleName_stateKeys_[_module];
    if (!_stateKeys) {
      throw makeError(ERR.CC_MODULE_NOT_FOUND, verboseInfo(`module[${_module}]`));
    }
  }

  const includeKey = _stateKeys.includes(_retKey);
  if (mustInclude) {
    if (!includeKey) {
      throw new Error(`key[${_retKey}] is not declared in module[${_module}] or selfState`);
    }
  } else {
    //传递了depKeys，_retKey不能再是stateKey
    if (includeKey) {
      throw new Error(`retKey[${_retKey}] can not be stateKey of module[${_module}] or selfState if you declare depKeys`);
    }
  }

  return { module: _module, retKey: _retKey };
}