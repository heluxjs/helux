import { okeys, safeGetObjectFromObject, safeGetArrayFromObject, makeError, verboseInfo, isPlainJsonObject, justTip } from '../../support/util';
import { ERR, CATE_MODULE } from '../../support/constant';
import ccContext from '../../cc-context';

const { moduleName_stateKeys_ } = ccContext;

/**
computed('foo/firstName', ()=>{});

computed('foo/firstName', {
  fn: ()=>{},
  compare: false,
  depKeys: ['firstName'],
});

computed({
  'foo/firstName':()=>{},
  'foo/fullName':{
    fn:()=>{},
    depKeys:['firstName', 'lastName']
  }
});

computed(ctx=>({
  'foo/firstName':()=>{},
  'foo/fullName':{
    fn:()=>{},
    depKeys:['firstName', 'lastName']
  }
}))
*/

// cate: module | ref
export default function (cate, confMeta, item, handler, depKeys, compare, immediate) {
  if (!item) return;
  const itype = typeof item;

  let _descObj;
  if (itype === 'string') {
    if (typeof handler === 'object') _descObj = { [item]: handler };
    else _descObj = { [item]: { fn: handler, depKeys, compare, immediate } };
  } else if (itype === 'object') {
    _descObj = item;
  } else if (itype === 'function') {
    _descObj = item(confMeta.refCtx);
    if (!isPlainJsonObject(_descObj)) throw new Error(`type of ${confMeta.type} callback result must be an object`);
  }
  if (!_descObj) return;

  _parseDescObj(cate, confMeta, _descObj);
};

function _parseDescObj(cate, confMeta, descObj) {
  const { computedCompare, watchCompare, watchImmediate } = ccContext;
  //读全局的默认值
  const defaultCompare =  confMeta.type === 'computed' ? computedCompare : watchCompare;

  okeys(descObj).forEach(key => {
    const val = descObj[key];
    const vType = typeof val;

    // 解释key，提取相关信息
    const { isStateKey, module, retKey } = _resolveKey(cate, confMeta, key);

    if (vType === 'function') {
      _checkIsStateKeyTrue(key, isStateKey);
      _mapDepDesc(confMeta, key, module, retKey, val, [retKey], watchImmediate, defaultCompare);
      return;
    }

    if (vType === 'object') {
      const { fn, depKeys, immediate = watchImmediate, compare = defaultCompare } = val;

      let _depKeys = depKeys;
      if (!_depKeys) {
        _checkIsStateKeyTrue(key, isStateKey);
        _depKeys = [retKey];
      }

      _mapDepDesc(confMeta, key, module, retKey, fn, _depKeys, immediate, compare);
    }
  });
}

// 映射依赖描述对象
function _mapDepDesc(confMeta, key, module, retKey, fn, depKeys, immediate, compare) {
  const dep = confMeta.dep;
  const moduleDepDesc = safeGetObjectFromObject(dep, module,
    { retKey_fn_: {}, stateKey_retKeys_: {}, fnCount: 0 }
  );
  const { retKey_fn_, stateKey_retKeys_ } = moduleDepDesc;

  if (retKey_fn_[retKey]) {
    if (!ccContext.isHotReloadMode()) throw new Error(`key[${retKey}] already declared!`);
    else justTip(`key[${retKey}] may duplicate, but now is hot reload mode, you can ignore this tip if you can make sure it is unique`)
  }

  let _depKeys = depKeys
  if (depKeys === '*') {
    _depKeys = ['*'];
  }
  if (!Array.isArray(_depKeys)) {
    throw new Error(`depKeys can only be an Array<string> or string *, --verbose-info: key[${key}]`);
  }

  retKey_fn_[retKey] = { fn, immediate, compare, depKeys };
  moduleDepDesc.fnCount++;
  
  const refCtx = confMeta.refCtx;
  if (refCtx) {
    if (confMeta.type === 'computed') refCtx.hasComputedFn = true;
    else refCtx.hasWatchFn = true;
  }

  _depKeys.forEach(sKey => {
    //一个依赖key列表里的stateKey会对应着多个结果key
    const retKeys = safeGetArrayFromObject(stateKey_retKeys_, sKey);
    retKeys.push(retKey);
  });
}

function _checkIsStateKeyTrue(key, isStateKey) {
  // concent can't deduce it's dependencyStateKeys
  if (!isStateKey) throw new Error(`key[${key}] is not a stateKey, please specify depKeys explicitly`);
  // if (!isStateKey) throw new Error(`key[${key}] is not a stateKey`);
}

function _resolveKey(cate, confMeta, key) {
  let _module = confMeta.module, _retKey = key, _stateKeys;
  if (key.includes('/')) {
    if (cate === CATE_MODULE) throw new Error(`key[${key}] is invalid, can not include slash`);
    const [module, retKey] = key.split('/');
    if (module) _module = module; // '/name' 支持这种申明方式
    _retKey = retKey;
  }

  if (_module === confMeta.module) {
    // 此时computed & watch可能观察的是私有的stateKey
    _stateKeys = okeys(confMeta.state);
  } else {
    // 对于属于bar的ref 配置key 'foo/a'时，会走入到此块
    _stateKeys = moduleName_stateKeys_[_module];
    if (!_stateKeys) {
      throw makeError(ERR.CC_MODULE_NOT_FOUND, verboseInfo(`module[${_module}]`));
    }
    if (!confMeta.connect[_module]) {
      throw new Error(`key[${key}] is invalid, module[${_module}] not been registered or connected`);
    }
  }

  // retKey作为将计算结果映射到refComputed | refConnectedComputed | moduleComputed 里的key
  return { isStateKey: _stateKeys.includes(_retKey), module: _module, retKey: _retKey };
}
