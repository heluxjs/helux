import { differStateKeys, safeGetObjectFromObject, okeys } from '../../support/util';

function getCacheDataContainer(){
  return {
    module: {
      computed: {},
      watch: {},
    },
    ref: {
      computed: {},
      watch: {},
      effect: {},
    },
  };
}

let cacheArea_pickedRetKeys_ = getCacheDataContainer();

function _wrapFn(retKey, retKey_fn_) {
  const { fn, depKeys } = retKey_fn_[retKey];
  return { retKey, fn, depKeys };
}

export function clearCachedData(){
  cacheArea_pickedRetKeys_ = getCacheDataContainer();
}

// cate module | ref
// type computed | watch
export default function (isBeforeMount, cate, type, depDesc, stateModule, oldState, committedState, cUkey) {
  const moduleDep = depDesc[stateModule];
  const pickedFns = [];

  if (!moduleDep) return { pickedFns, setted:[], changed:[] };
  const { retKey_fn_, stateKey_retKeys_, fnCount } = moduleDep;

  /** 首次调用 */
  if (isBeforeMount) {
    const retKeys = okeys(retKey_fn_);
    const setted = okeys(committedState);
    const changed = setted;
    if (type === 'computed') {
      return {
        pickedFns: retKeys.map(retKey => _wrapFn(retKey, retKey_fn_)), setted, changed
      };
    }
    
    // for watch
    retKeys.forEach(retKey => {
      const { fn, immediate, depKeys } = retKey_fn_[retKey];
      if (immediate) pickedFns.push({ retKey, fn, depKeys });
    });

    return { pickedFns, setted, changed };
  }

  // 这些目标stateKey的值发生了变化
  const { setted, changed } = differStateKeys(oldState, committedState);

  if (setted.length === 0) {
    return { pickedFns };
  }

  //用setted + changed + module 作为键，缓存对应的pickedFns，这样相同形状的committedState再次进入此函数时，方便快速直接命中pickedFns
  const cacheKey = setted.join(',') + '|' + changed.join(',') + '|' + stateModule;

  // 要求用户必须在setup里静态的定义完computed & watch，动态的调用computed & watch的回调因为缓存原因不会被触发
  const tmpNode = cacheArea_pickedRetKeys_[cate][type];
  const cachePool = cUkey ? safeGetObjectFromObject(tmpNode, cUkey) : tmpNode;
  const cachedPickedRetKeys = cachePool[cacheKey];

  if (cachedPickedRetKeys) {
    return {
      pickedFns: cachedPickedRetKeys.map(retKey => _wrapFn(retKey, retKey_fn_)),
      setted,
      changed,
    };
  }

  _pickFn(pickedFns, setted, changed, retKey_fn_, stateKey_retKeys_, fnCount);
  cachePool[cacheKey] = pickedFns.map(v => v.retKey);

  return { pickedFns, setted, changed };
}


function _pickFn(pickedFns, settedStateKeys, changedStateKeys, retKey_fn_, stateKey_retKeys_, fnCount) {
  if (settedStateKeys.length === 0) return;

  // 把*的函数先全部挑出来, 有key的值发生变化了或者有设值行为
  const starRetKeys = stateKey_retKeys_['*'];
  if (starRetKeys) {
    const isKeyValChanged = changedStateKeys.length > 0;

    starRetKeys.forEach(retKey => {
      const { fn, compare, depKeys } = retKey_fn_[retKey];
      const toPush = { retKey, fn, depKeys };
      if (compare) {
        if (isKeyValChanged) pickedFns.push(toPush);
        return;
      }
      pickedFns.push(toPush);
    });
  }

  // 继续遍历settedStateKeys, 挑选出剩余的目标fn（非*相关的）
  if (pickedFns.length < fnCount) {
    const retKey_picked_ = {};
    const len = settedStateKeys.length;
    for (let i = 0; i < len; i++) {
      const stateKey = settedStateKeys[i];
      const retKeys = stateKey_retKeys_[stateKey];

      //发生变化了的stateKey不一定在依赖列表里
      if (!retKeys) continue;

      retKeys.forEach(retKey => {
        //没有挑过的方法才挑出来
        if (!retKey_picked_[retKey]) {
          const { fn, compare, depKeys } = retKey_fn_[retKey];

          let canPick = true;
          if (compare && !changedStateKeys.includes(stateKey)) {
            canPick = false;
          }

          if (canPick) {
            retKey_picked_[retKey] = true;
            pickedFns.push({ retKey, fn, depKeys });
          }

        }
      });

      if (pickedFns.length === fnCount) break;
    }
  }
}