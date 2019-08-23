import { differStateKeys } from '../../support/util';

const cacheKey_pickedFns_ = {};

export default function (depDesc, stateModule, oldState, committedState) {
  const moduleDep = depDesc[stateModule];
  const pickedFns = [];
  
  if (moduleDep) {
    // 这些目标stateKey的值发生了变化
    const targetStateKeys = differStateKeys(oldState, committedState);
    if (targetStateKeys.length === 0) {
      return [];
    }

    const { stateKey_retKeys_, retKey_fn_, fnCount } = moduleDep;
    //用targetStateKeys + module 作为键，缓存对应的pickedFns，这样相同形状的committedState再次进入此函数时，方便快速直接命中pickedFns
    const cacheKey = targetStateKeys.join(',') + '|' + stateModule;

    // 要求用户必须在setup里静态的定义完computed & watch
    const cachedPickedFns = cacheKey_pickedFns_[cacheKey];

    if (cachedRetKeys) {
      return cachedPickedFns;
    } else {
      const retKey_picked_ = {};

      // 把*的函数先全部挑出来
      const starRetKeys = stateKey_retKeys_['*'];
      if (starRetKeys) {
        starRetKeys.forEach(retKey => pickedFns.push({ retKey, fn: retKey_fn_[retKey] }));
      }

      // 还没有挑完，再遍历targetStateKeys, 挑选出剩余的目标fn
      if (pickedFns.length < fnCount) {
        const len = targetStateKeys.length;
        for (let i = 0; i < len; i++) {
          const stateKey = targetStateKeys[i];
          const retKeys = stateKey_retKeys_[stateKey];

          retKeys.forEach(retKey => {
            //没有挑过的方法才挑出来
            if (!retKey_picked_[retKey]) {
              retKey_picked_[retKey] = true;
              pickedFns.push({ retKey, fn: retKey_fn_[retKey] });
            }
          });

          if (pickedFns.length === fnCount) break;
        }
      }

      cacheKey_pickedFns_[cacheKey] = pickedFns;
    }
  }

  return pickedFns;
}