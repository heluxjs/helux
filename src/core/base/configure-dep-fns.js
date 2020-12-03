/** @typedef {import('../../types-inner').IRefCtx} Ctx */
import {
  okeys, safeGet, safeGetArray, makeError, verboseInfo, isPJO, justWarning,
  makeCuDepDesc, safeGetThenNoDupPush, makeFnDesc,
} from '../../support/util';
import { ERR, CATE_REF, FN_CU } from '../../support/constant';
import { FUNCTION } from '../../support/priv-constant';
import ccContext from '../../cc-context';
import { makeWaKey } from '../../cc-context/wakey-ukey-map';
import uuid from './uuid';

const { moduleName2stateKeys, runtimeVar } = ccContext;
let sortFactor = 1;

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
export default function (cate, confMeta, item, handler, depKeysOrOpt) {
  /** @type Ctx */
  const ctx = confMeta.refCtx;
  const type = confMeta.type;
  if (cate === CATE_REF && !ctx.__$$inBM) {
    const tip = `${cate} ${type} must been called in setup block`;
    if (runtimeVar.isStrict) throw new Error(tip);
    justWarning(tip);
    return;
  }

  if (!item) return;
  const itype = typeof item;

  let _descObj;
  if (itype === 'string') {// retKey
    if (isPJO(handler)) _descObj = { [item]: handler };
    else if (typeof handler === FUNCTION) _descObj = { [item]: makeFnDesc(handler, depKeysOrOpt) };
  } else if (isPJO(item)) {
    _descObj = item;
  } else if (itype === FUNCTION) {
    _descObj = item(ctx);
    if (!isPJO(_descObj)) throw new Error(`type of ${type} callback result must be an object`);
  }

  if (!_descObj) {
    justWarning(`${cate} ${type} param type error`);
    return;
  }

  _parseDescObj(cate, confMeta, _descObj);
}

function _parseDescObj(cate, confMeta, descObj) {
  const { computedCompare, watchCompare, watchImmediate } = runtimeVar;
  //读全局的默认值
  const defaultCompare = confMeta.type === FN_CU ? computedCompare : watchCompare;
  const callerModule = confMeta.module;

  okeys(descObj).forEach((retKey) => {
    const val = descObj[retKey];
    const vType = typeof val;

    let targetItem = val;
    if (vType === FUNCTION) {
      targetItem = { fn: val };
    }

    if (isPJO(targetItem)) {
      const { fn, immediate = watchImmediate, compare = defaultCompare, lazy, retKeyDep = true } = targetItem;

      // 确保用户显示的传递null、undefined、0、都置为依赖收集状态
      const depKeys = targetItem.depKeys || '-';

      // if user don't pass sort explicitly, computed fn will been called orderly by sortFactor
      const sort = targetItem.sort || sortFactor++;

      const fnUid = uuid('mark');
      
      if (depKeys === '*' || depKeys === '-') {
        // 处于依赖收集，且用户没有显式的通过设置retKeyDep为false来关闭同名依赖规则时，会自动设置同名依赖
        const mapSameName = depKeys === '-' && retKeyDep;
        const { pureKey, module } = _resolveKey(confMeta, callerModule, retKey, mapSameName);

        _checkRetKeyDup(cate, confMeta, fnUid, pureKey);
        // when retKey is '/xxxx', here need pass xxxx as retKey
        _mapDepDesc(cate, confMeta, module, pureKey, fn, depKeys, immediate, compare, lazy, sort);
      } else {
        if (depKeys.length === 0) {
          const { pureKey, module } = _resolveKey(confMeta, callerModule, retKey); //consume retKey is stateKey

          _checkRetKeyDup(cate, confMeta, fnUid, pureKey);
          _mapDepDesc(cate, confMeta, module, pureKey, fn, depKeys, immediate, compare, lazy, sort);
        } else {// ['foo/b1', 'bar/b1'] or ['b1', 'b2']
          const { pureKey, moduleOfKey } = _resolveKey(confMeta, callerModule, retKey);
          const stateKeyModule = moduleOfKey;
          _checkRetKeyDup(cate, confMeta, fnUid, pureKey);

          // 给depKeys按module分类，此时它们都指向同一个retKey，同一个fn，但是会被分配ctx.computedDep或者watchDep的不同映射里
          const module2depKeys = {};
          // ['foo/b1', 'bar/b1']
          depKeys.forEach(depKey => {
            // !!!这里只是单纯的解析depKey，不需要有映射同名依赖的行为，映射同名依赖仅发生在传入retKey的时候
            // consume depKey is stateKey
            const { isStateKey, pureKey, module } = _resolveKey(confMeta, callerModule, depKey); 

            // ok: retKey: 'xxxx' depKeys:['foo/f1', 'foo/f2', 'bar/b1', 'bar/b2'], 
            //     some stateKey belong to foo, some belong to bar
            // ok: retKey: 'foo/xxxx' depKeys:['f1', 'f2'], all stateKey belong to foo
            // ok: retKey: 'foo/xxxx' depKeys:['foo/f1', 'foo/f2'], all stateKey belong to foo

            // both left and right include module but they are not equal, this situation is not ok!
            // not ok: retKey: 'foo/xxxx' depKeys:['foo/f1', 'foo/f2', 'bar/b1', 'bar/b2']

            if (stateKeyModule && module !== stateKeyModule) {
              throw new Error(
                `found slash both in retKey[${retKey}] and depKey[${depKey}], but their module is different`
              );
            }
            const depKeys = safeGetArray(module2depKeys, module);
            if (!isStateKey) {
              throw new Error(`depKey[${depKey}] invalid, module[${module}] doesn't include its stateKey[${pureKey}]`);
            }else{
              // 当一个实例里 ctx.computed ctx.watch 的depKeys里显示的标记了依赖时
              // 在这里需要立即记录依赖了
              _mapIns(confMeta, module, pureKey);
            }

            depKeys.push(pureKey);
          });

          okeys(module2depKeys).forEach(m => {
            // 指向同一个fn，允许重复
            _mapDepDesc(cate, confMeta, m, pureKey, fn, module2depKeys[m], immediate, compare, lazy, sort);
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

  const isStatic = Array.isArray(depKeys) && depKeys.length === 0;

  // 确保static computed优先优先执行
  let targetSort = sort;
  if (isStatic) {
    if (targetSort >= 0) targetSort = -1;
  } else {
    if (sort < 0) targetSort = 0;
  }

  const fnDesc = { fn, immediate, compare, depKeys, sort: targetSort, isStatic };
  // retKey作为将计算结果映射到refComputed | moduleComputed 里的key
  if (retKey_fn_[retKey]) {
    if (cate !== CATE_REF) {// 因为热加载，对于module computed 定义总是赋值最新的，
      retKey_fn_[retKey] = fnDesc;
      retKey_lazy_[retKey] = lazy;
    }
    // do nothing
  } else {
    retKey_fn_[retKey] = fnDesc;
    retKey_lazy_[retKey] = lazy;
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

  const allKeyDep = depKeys === '*';
  const targetDepKeys = allKeyDep ? ['*'] : depKeys;
  if (allKeyDep) {
    retKey_stateKeys_[retKey] = moduleName2stateKeys[module];
  }

  targetDepKeys.forEach(sKey => {
    if (!allKeyDep) safeGetThenNoDupPush(retKey_stateKeys_, retKey, sKey);
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
  const moduleStateKeys = moduleName2stateKeys[targetModule];
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
