import { okeys, safeGetObjectFromObject, safeGetArrayFromObject, makeError, verboseInfo, isPJO, justWarning, justTip } from '../../support/util';
import { ERR, CATE_REF } from '../../support/constant';
import ccContext from '../../cc-context';
import uuid from './uuid';

const { moduleName_stateKeys_, runtimeVar } = ccContext;

/**
computed('foo/firstName', ()=>{});
//or
computed('firstName', ()=>{}, ['foo/firstName']);

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
// or 
computed({
  'foo/firstName':()=>{},
  'fullName':{
    fn:()=>{},
    depKeys:['foo/firstName', 'foo/lastName']
  }
});

computed(ctx=>{ return cuDesc}
*/

// cate: module | ref
export default function (cate, confMeta, item, handler, depKeys, compare, immediate) {
  if (!item) return;
  const itype = typeof item;

  let _descObj;
  if (itype === 'string') {// retKey
    if (isPJO(handler)) _descObj = { [item]: handler };
    else _descObj = { [item]: { fn: handler, depKeys, compare, immediate } };
  } else if (isPJO(item)) {
    _descObj = item;
  } else if (itype === 'function') {
    _descObj = item(confMeta.refCtx);
    if (!isPJO(_descObj)) throw new Error(`type of ${confMeta.type} callback result must be an object`);
  }
  if (!_descObj) {
    justWarning(`${cate} ${confMeta.type} param type error`);
    return;
  }

  _parseDescObj(cate, confMeta, _descObj);
};

function _parseDescObj(cate, confMeta, descObj) {
  const { computedCompare, watchCompare, watchImmediate } = runtimeVar;
  //读全局的默认值
  const defaultCompare = confMeta.type === 'computed' ? computedCompare : watchCompare;
  const callerModule = confMeta.module;

  okeys(descObj).forEach(retKey => {
    const val = descObj[retKey];
    const vType = typeof val;

    let targetItem = val;
    if (vType === 'function') {
      targetItem = { fn: val }
    }

    if (isPJO(targetItem)) {
      const { fn, depKeys, immediate = watchImmediate, compare = defaultCompare } = targetItem;
      const fnUid = uuid('mark');

      if (depKeys === '*') {
        const { isStateKey, stateKey } = _resolveStateKey(confMeta, callerModule, retKey);
        if (!isStateKey) throw new Error(`retKey[${retKey}] is not a state key of module[${callerModule}]`);
        _checkRetKeyDup(cate, confMeta, fnUid, stateKey);
        // when retKey is '/xxxx', here need pass xxxx, so pass stateKey as retKey
        _mapDepDesc(cate, confMeta, callerModule, stateKey, fn, depKeys, immediate, compare);
      } else {// ['foo/b1', 'bar/b1'] or null or undefined
        if (depKeys && !Array.isArray(depKeys)) throw new Error('depKeys must an string array or *');

        if (!depKeys || depKeys.length === 0) {
          const { isStateKey, stateKey, module } = _resolveStateKey(confMeta, callerModule, retKey); //consume retKey is stateKey
          let targetDepKeys = [];
          if (!depKeys && isStateKey) {
            targetDepKeys = [stateKey];// regenerate depKeys
          }
          _checkRetKeyDup(cate, confMeta, fnUid, stateKey);
          _mapDepDesc(cate, confMeta, module, stateKey, fn, targetDepKeys, immediate, compare);
        } else {
          let stateKeyModule = '', targetRetKey = retKey;
          if (retKey.includes('/')) {
            const [m, r] = retKey.split('/');
            stateKeyModule = m;
            targetRetKey = r;
          }
          _checkRetKeyDup(cate, confMeta, fnUid, targetRetKey);

          // 给depKeys按module分类，此时它们都指向同一个retKey，同一个fn
          const module_depKeys_ = {};
          depKeys.forEach(depKey => {
            const { isStateKey, stateKey, module } = _resolveStateKey(confMeta, callerModule, depKey); //consume depKey is stateKey

            // ok: retKey: 'xxxx' depKeys:['foo/f1', 'foo/f2', 'bar/b1', 'bar/b2'], some stateKey belong to foo, some belong to bar
            // ok: retKey: 'foo/xxxx' depKeys:['f1', 'f2'], all stateKey belong to foo
            // ok: retKey: 'foo/xxxx' depKeys:['foo/f1', 'foo/f2'], all stateKey belong to foo

            // both left and right include module but they are not equal, this situation is not ok!
            // not ok: retKey: 'foo/xxxx' depKeys:['foo/f1', 'foo/f2', 'bar/b1', 'bar/b2']

            if (stateKeyModule && module !== stateKeyModule) {
              throw new Error(`including slash both in retKey[${retKey}] and depKey[${depKey}] founded, but their module is different`);
            }
            const depKeys = safeGetArrayFromObject(module_depKeys_, module);
            if (!isStateKey) {
              throw new Error(`depKey[${depKey}] invalid, module[${module}] doesn't include its stateKey[${stateKey}]`);
            }
            depKeys.push(stateKey);
          });

          okeys(module_depKeys_).forEach(m => {
            _mapDepDesc(cate, confMeta, m, targetRetKey, fn, module_depKeys_[m], immediate, compare, true);// 指向同一个fn，允许重复
          });
        }
      }
    }else{
      justWarning(`retKey[${retKey}] item type error`);
    }

  });
}

function _checkRetKeyDup(cate, confMeta, fnUid, retKey) {
  if (cate === CATE_REF) {
    const { ccUniqueKey, retKey_fnUid_ } = confMeta.refCtx;
    const type = confMeta.type;
    const typedRetKey = `${type}_${retKey}`;
    const mappedFn = retKey_fnUid_[typedRetKey];
    if (mappedFn) {
      throw new Error(`ccUKey[${ccUniqueKey}], retKey[${retKey}] duplicate in ref ${type}`);
    } else {
      retKey_fnUid_[typedRetKey] = fnUid;
    }
  }
}

// 映射依赖描述对象
function _mapDepDesc(cate, confMeta, module, retKey, fn, depKeys, immediate, compare) {
  const dep = confMeta.dep;
  const moduleDepDesc = safeGetObjectFromObject(dep, module,
    { retKey_fn_: {}, stateKey_retKeys_: {}, fnCount: 0 }
  );
  const { retKey_fn_, stateKey_retKeys_ } = moduleDepDesc;

  const fnDesc = { fn, immediate, compare, depKeys };
  // retKey作为将计算结果映射到refComputed | moduleComputed 里的key
  if (retKey_fn_[retKey]) {
    if (cate !== CATE_REF) {// 因为热加载，对于module computed 定义总是赋值最新的，
      retKey_fn_[retKey] = fnDesc;
    }
    // do nothing
  } else {
    retKey_fn_[retKey] = fnDesc;
    moduleDepDesc.fnCount++;
  }

  let _depKeys = depKeys
  if (depKeys === '*') {
    _depKeys = ['*'];
  }

  if (cate === CATE_REF) {
    confMeta.retKeyFns[retKey] = retKey_fn_[retKey];
  }

  const refCtx = confMeta.refCtx;
  if (refCtx) {
    if (confMeta.type === 'computed') refCtx.hasComputedFn = true;
    else refCtx.hasWatchFn = true;
  }

  _depKeys.forEach(sKey => {
    //一个依赖key列表里的stateKey会对应着多个结果key
    const retKeys = safeGetArrayFromObject(stateKey_retKeys_, sKey);
    if (!retKeys.includes(retKey)) retKeys.push(retKey);
  });
}


function _resolveStateKey(confMeta, module, stateKey) {
  let targetModule = module, targetStateKey = stateKey;
  if (stateKey.includes('/')) {
    const [_module, _stateKey] = stateKey.split('/');
    if (_module) targetModule = _module; // '/name' 支持这种申明方式
    targetStateKey = _stateKey;
  }

  let stateKeys;
  if (targetModule === confMeta.module) {
    // 此时computed & watch观察的是对象的所有stateKeys
    stateKeys = confMeta.stateKeys;
  } else {
    // 对于属于bar的ref 配置key 'foo/a'时，会走入到此块
    stateKeys = moduleName_stateKeys_[targetModule];
    if (!stateKeys) {
      throw makeError(ERR.CC_MODULE_NOT_FOUND, verboseInfo(`module[${targetModule}]`));
    }
    if (!confMeta.connect[targetModule]) {
      throw makeError(ERR.CC_MODULE_NOT_CONNECTED, verboseInfo(`module[${targetModule}], stateKey[${targetStateKey}]`));
    }
  } 

  return { isStateKey: stateKeys.includes(targetStateKey), stateKey: targetStateKey, module: targetModule };
}
