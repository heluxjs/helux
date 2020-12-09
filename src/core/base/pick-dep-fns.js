/* eslint-disable camelcase */
import { differStateKeys, safeGet, okeys, isObjectNull } from '../../support/util';

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

function _wrapFn(retKey, retKey2fn, isLazy) {
  const { fn, depKeys, sort } = retKey2fn[retKey];
  return { retKey, fn, depKeys, isLazy, sort };
}

// asc sort
const sortCb = (o1,o2)=> o1.sort - o2.sort;

export function clearCachedData(){
  cacheArea_pickedRetKeys_ = getCacheDataContainer();
}

// cate module | ref
// type computed | watch
export default function (isBeforeMount, cate, type, depDesc, stateModule, oldState, committedState, cUkey) {
  const moduleDep = depDesc[stateModule];// it can be refModuleDep or moduleDep
  const pickedFns = [];

  // 针对type module， init-module-state时，已对_computedValueOri赋值了默认cuDesc，
  // 所以此时可以安全的直接判断非关系，而不用担心 {}对象存在
  if (isObjectNull(moduleDep)) return { pickedFns, setted: [], changed: [], retKey2stateKeys: {} };

  const { retKey2fn, retKey2lazy, stateKey2retKeys, retKey2stateKeys, fnCount } = moduleDep;

  /** 首次调用 */
  if (isBeforeMount) {
    const retKeys = okeys(retKey2fn);
    const setted = okeys(committedState);
    const changed = setted;
    if (type === 'computed') {
      return {
        pickedFns: retKeys.map(retKey => _wrapFn(retKey, retKey2fn, retKey2lazy[retKey])).sort(sortCb), 
        setted, changed, retKey2stateKeys,
      };
    }
    
    // for watch
    retKeys.forEach(retKey => {
      const { fn, immediate, depKeys, sort } = retKey2fn[retKey];
      if (immediate) pickedFns.push({ retKey, fn, depKeys, sort });
    });

    pickedFns.sort(sortCb);
    return { pickedFns, setted, changed, retKey2stateKeys };
  }

  // 这些目标stateKey的值发生了变化
  const { setted, changed } = differStateKeys(oldState, committedState);

  if (setted.length === 0) {
    return { pickedFns, setted: [], changed: [], retKey2stateKeys: {} };
  }

  //用setted + changed + module 作为键，缓存对应的pickedFns，这样相同形状的committedState再次进入此函数时，方便快速直接命中pickedFns
  const cacheKey = `${setted.join(',')}|${changed.join(',')}|${stateModule}`;

  // 要求用户必须在setup里静态的定义完computed & watch，动态的调用computed & watch的回调因为缓存原因不会被触发
  const tmpNode = cacheArea_pickedRetKeys_[cate][type];
  const cachePool = cUkey ? safeGet(tmpNode, cUkey) : tmpNode;
  const cachedPickedRetKeys = cachePool[cacheKey];

  if (cachedPickedRetKeys) {
    // todo, for 2.5, call checkFnByDepPath with variable depKey_pathDepKeys_
    return {
      pickedFns: cachedPickedRetKeys.map(retKey => _wrapFn(retKey, retKey2fn, retKey2lazy[retKey])),
      setted, changed, retKey2stateKeys,
    };
  }

  _pickFn(pickedFns, setted, changed, retKey2fn, stateKey2retKeys, retKey2lazy, fnCount);
  cachePool[cacheKey] = pickedFns.map(v => v.retKey);

   // todo, for 2.5, call checkFnByDepPath with variable depKey_pathDepKeys_
  return { pickedFns, setted, changed, retKey2stateKeys };
}


function _pickFn(pickedFns, settedStateKeys, changedStateKeys, retKey2fn, stateKey2retKeys, retKey2lazy, fnCount) {
  if (settedStateKeys.length === 0) return;

  // 把*的函数先全部挑出来, 有key的值发生变化了或者有设值行为
  const starRetKeys = stateKey2retKeys['*'];
  if (starRetKeys) {
    const isKeyValChanged = changedStateKeys.length > 0;

    starRetKeys.forEach(retKey => {
      const { fn, compare, depKeys, sort } = retKey2fn[retKey];
      const toPush = { retKey, fn, depKeys, isLazy: retKey2lazy[retKey], sort };
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
      const retKeys = stateKey2retKeys[stateKey];

      //发生变化了的stateKey不一定在依赖列表里
      if (!retKeys) continue;

      retKeys.forEach(retKey => {
        //没有挑过的方法才挑出来
        if (!retKey_picked_[retKey]) {
          const { fn, compare, depKeys, sort } = retKey2fn[retKey];

          let canPick;
          const isValChanged = changedStateKeys.includes(stateKey);

          // 检测出发生了变化，就一定pick
          if (isValChanged) {
            canPick = true;
          } else {
            // 对于未采用 immutable写法的object是检测不出是否改变的，
            // 因为指向同一个引用，isValChanged一定是false
            // 所以如果compare 为true，则要求用户严格采用immutable写法
            // 为false的话，进入到这里，是已经set的key，canPick一定为true
            canPick = compare ? isValChanged : true;
          }

          if (canPick) {
            retKey_picked_[retKey] = true;
            pickedFns.push({ retKey, fn, depKeys, isLazy: retKey2lazy[retKey], sort });
          }
        }
      });

      if (pickedFns.length === fnCount) break;
    }
  }

  pickedFns.sort(sortCb);
}
