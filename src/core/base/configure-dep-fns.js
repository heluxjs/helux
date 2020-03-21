import {
  okeys, safeGet, safeGetArray, makeError, verboseInfo, isPJO, justWarning,
  makeCuDepDesc, safeGetThenNoDupPush,
} from '../../support/util';
import { ERR, CATE_REF, FN_CU } from '../../support/constant';
import ccContext from '../../cc-context';
import { makeWaKey } from '../../cc-context/wakey-ukey-map';
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
  const ctx = confMeta.refCtx;
  const type = confMeta.type;
  if (cate === CATE_REF) {
    if (!ctx.__$$inBM) {
      justWarning(`${cate} ${type} must be been called in setup block`);
      return;
    }
  }

  if (!item) return;
  const itype = typeof item;

  let _descObj;
  if (itype === 'string') {// retKey
    if (isPJO(handler)) _descObj = { [item]: handler };
    else _descObj = { [item]: { fn: handler, depKeys, compare, immediate } };
  } else if (isPJO(item)) {
    _descObj = item;
  } else if (itype === 'function') {
    _descObj = item(ctx);
    if (!isPJO(_descObj)) throw new Error(`type of ${type} callback result must be an object`);
  }
  if (!_descObj) {
    justWarning(`${cate} ${type} param type error`);
    return;
  }

  _parseDescObj(cate, confMeta, _descObj);
};

function _parseDescObj(cate, confMeta, descObj) {
  const { computedCompare, watchCompare, watchImmediate } = runtimeVar;
  //读全局的默认值
  const defaultCompare = confMeta.type === 'computed' ? computedCompare : watchCompare;
  const callerModule = confMeta.module;

  okeys(descObj).forEach((retKey, idx) => {
    const val = descObj[retKey];
    const vType = typeof val;

    let targetItem = val;
    if (vType === 'function') {
      targetItem = { fn: val }
    }

    if (isPJO(targetItem)) {
      // depKeys设置为默认自动收集
      const { fn, immediate = watchImmediate, compare = defaultCompare, lazy } = targetItem;
      const depKeys = targetItem.depKeys || '-';

      // 对于module computed以一个文件暴露出来一堆计算函数集合且没有使用defComputed时，使用key下标作为sort值
      // !!!注意在一个文件里即写defComputed又写普通函数，这两类计算函数各自的执行顺序是和书写顺序一致的，
      // 在自定义函数不超过一千个时，它们在一起时的执行顺序是总是执行完毕自定义函数再执行defComputed定义函数
      // 超过一千个时，它们在一起时的执行顺序是不被保证的
      const sort = targetItem.sort || confMeta.sort || idx;
      // if user don't pass sort explicitly, computed fn will been called orderly by sortFactor

      const fnUid = uuid('mark');
      
      if (depKeys === '*' || depKeys === '-') {
        // 处于依赖收集时才设置同名依赖
        const mapSameName = depKeys === '-';
        const { pureKey, module } = _resolveKey(confMeta, callerModule, retKey, mapSameName);

        _checkRetKeyDup(cate, confMeta, fnUid, pureKey);
        // when retKey is '/xxxx', here need pass xxxx as retKey
        _mapDepDesc(cate, confMeta, module, pureKey, fn, depKeys, immediate, compare, lazy, sort);
      } else {// ['foo/b1', 'bar/b1'] or null or undefined
        if (depKeys && !Array.isArray(depKeys)) throw new Error('depKeys must an string array or *');

        if (!depKeys || depKeys.length === 0) {
          const { isStateKey, pureKey, module } = _resolveKey(confMeta, callerModule, retKey); //consume retKey is stateKey
          let targetDepKeys = [];
          if (!depKeys && isStateKey) {
            targetDepKeys = [pureKey];// regenerate depKeys
          }
          _checkRetKeyDup(cate, confMeta, fnUid, pureKey);
          _mapDepDesc(cate, confMeta, module, pureKey, fn, targetDepKeys, immediate, compare, lazy, sort);
        } else {
          const { pureKey, moduleOfKey } = _resolveKey(confMeta, callerModule, retKey);
          const stateKeyModule = moduleOfKey;
          _checkRetKeyDup(cate, confMeta, fnUid, pureKey);

          // 给depKeys按module分类，此时它们都指向同一个retKey，同一个fn，但是会被分配ctx.computedDep或者watchDep的不同映射里
          const module_depKeys_ = {};
          // ['foo/b1', 'bar/b1']
          depKeys.forEach(depKey => {
            // !!!这里只是单纯的解析depKey，不需要有映射同名依赖的行为
            // 映射同名依赖仅发生在传入retKey的时候
            const { isStateKey, pureKey, module } = _resolveKey(confMeta, callerModule, depKey); //consume depKey is stateKey

            // ok: retKey: 'xxxx' depKeys:['foo/f1', 'foo/f2', 'bar/b1', 'bar/b2'], some stateKey belong to foo, some belong to bar
            // ok: retKey: 'foo/xxxx' depKeys:['f1', 'f2'], all stateKey belong to foo
            // ok: retKey: 'foo/xxxx' depKeys:['foo/f1', 'foo/f2'], all stateKey belong to foo

            // both left and right include module but they are not equal, this situation is not ok!
            // not ok: retKey: 'foo/xxxx' depKeys:['foo/f1', 'foo/f2', 'bar/b1', 'bar/b2']

            if (stateKeyModule && module !== stateKeyModule) {
              throw new Error(`including slash both in retKey[${retKey}] and depKey[${depKey}] founded, but their module is different`);
            }
            const depKeys = safeGetArray(module_depKeys_, module);
            if (!isStateKey) {
              throw new Error(`depKey[${depKey}] invalid, module[${module}] doesn't include its stateKey[${pureKey}]`);
            }else{
              // 当一个实例里 ctx.computed ctx.watch 的depKeys里显示的标记了依赖时
              // 在这里需要立即记录依赖了
              _mapIns(confMeta, module, pureKey);
            }

            depKeys.push(pureKey);
          });

          okeys(module_depKeys_).forEach(m => {
            // 指向同一个fn，允许重复
            _mapDepDesc(cate, confMeta, m, pureKey, fn, module_depKeys_[m], immediate, compare, lazy, sort);
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

// !!!由实例调用computed或者watch，监听同名的retKey，更新stateKey与retKey的关系映射
function _mapSameNameRetKey(confMeta, module, retKey, isModuleStateKey) {
  const dep = confMeta.dep;
  const moduleDepDesc = safeGet(dep, module, makeCuDepDesc());
  const { stateKey_retKeys_, retKey_stateKeys_ } = moduleDepDesc;

  safeGetThenNoDupPush(stateKey_retKeys_, retKey, retKey);
  safeGetThenNoDupPush(retKey_stateKeys_, retKey, retKey);

  // 记录依赖
  isModuleStateKey && _mapIns(confMeta, module, retKey)
}

function _mapIns(confMeta, module, retKey) {
  const ctx = confMeta.refCtx;
  if (ctx) {
    ctx.__$$staticWaKeys[makeWaKey(module, retKey)] = 1;
  }
}

// 映射依赖描述对象, module即是取的dep里的key
function _mapDepDesc(cate, confMeta, module, retKey, fn, depKeys, immediate, compare, lazy, sort) {
  const dep = confMeta.dep;
  const moduleDepDesc = safeGet(dep, module, makeCuDepDesc());
  const { retKey_fn_, stateKey_retKeys_, retKey_lazy_, retKey_stateKeys_ } = moduleDepDesc;

  const fnDesc = { fn, immediate, compare, depKeys, sort };
  // retKey作为将计算结果映射到refComputed | moduleComputed 里的key
  if (retKey_fn_[retKey]) {
    if (cate !== CATE_REF) {// 因为热加载，对于module computed 定义总是赋值最新的，
      retKey_fn_[retKey] = fnDesc;
      retKey_lazy_[retKey] = confMeta.isLazyComputed || lazy;
    }
    // do nothing
  } else {
    retKey_fn_[retKey] = fnDesc;
    retKey_lazy_[retKey] = confMeta.isLazyComputed || lazy;
    moduleDepDesc.fnCount++;
  }
  
  if (cate === CATE_REF) {
    confMeta.retKeyFns[retKey] = retKey_fn_[retKey];
  }
  
  const refCtx = confMeta.refCtx;
  if (refCtx) {
    if (confMeta.type === 'computed') refCtx.hasComputedFn = true;
    else refCtx.hasWatchFn = true;
  }

  //处于自动收集依赖状态，首次遍历完计算函数后之后再去写stateKey_retKeys_, retKey_stateKeys_
  // in find-dep-fns-to-execute.js setStateKeyRetKeysMap
  if (depKeys === '-') return;

  let _depKeys = depKeys === '*' ? ['*'] : depKeys;
  if (depKeys === '*') retKey_stateKeys_[retKey] = moduleName_stateKeys_[module];

  _depKeys.forEach(sKey => {
    //一个依赖key列表里的stateKey会对应着多个结果key
    safeGetThenNoDupPush(stateKey_retKeys_, sKey, retKey);
  });
}

// 分析retKey或者depKey是不是stateKey,
// 返回的是净化后的key
function _resolveKey(confMeta, module, retKey, mapSameName = false) {
  let targetModule = module, targetRetKey = retKey, moduleOfKey = '';

  if (retKey.includes('/')) {
    const [_module, _stateKey] = retKey.split('/');
    if (_module) {
      moduleOfKey = _module;
      targetModule = _module; // '/name' 支持这种申明方式
    }
    targetRetKey = _stateKey;
  }

  let stateKeys;
  const moduleStateKeys = moduleName_stateKeys_[targetModule];
  if (targetModule === confMeta.module) {
    // 此时computed & watch观察的是对象的所有stateKeys
    stateKeys = confMeta.stateKeys;
  } else {
    // 对于属于bar的ref 配置key 'foo/a'时，会走入到此块
    stateKeys = moduleStateKeys;
    if (!stateKeys) {
      throw makeError(ERR.CC_MODULE_NOT_FOUND, verboseInfo(`module[${targetModule}]`));
    }
    if (!confMeta.connect[targetModule]) {
      throw makeError(ERR.CC_MODULE_NOT_CONNECTED, verboseInfo(`module[${targetModule}], retKey[${targetRetKey}]`));
    }
  }

  const isStateKey = stateKeys.includes(targetRetKey);
  if (mapSameName && isStateKey) {
    _mapSameNameRetKey(confMeta, targetModule, targetRetKey, moduleStateKeys.includes(targetRetKey));
  }

  return { isStateKey, pureKey: targetRetKey, module: targetModule, moduleOfKey };
}
