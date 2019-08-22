import { okeys } from '../../support/util';

const cacheKey_retKeys_ = {};

export default function (depDesc, stateModule, committedState) {
  const moduleDep = depDesc[stateModule];

  //用committedState 的keys + module 作为键，缓存对应的retKeys，这样相同形状的committedState再次进入此函数时，方便快速直接命中retKeys
  const cacheKey = okeys(committedState).join(',') + '|' + stateModule;
  
  const pickedFns = [];
  if (moduleDep) {
    
    const { stateKey_retKeys_, retKey_fn_, fnCount } = moduleDep;

    const cachedRetKeys = cacheKey_retKeys_[cacheKey];
    if (cachedRetKeys) {
      cachedRetKeys.forEach(retKey => {
        pickedFns.push({ retKey, fn: retKey_fn_[retKey] });
      });
    } else {
      const retKey_picked_ = {};
      const pickedRetKeys = [];

      //从stateKey_retKeys_入手开始遍历
      const stateKeys = okeys(stateKey_retKeys_);
      const len = stateKeys.length;
      for (let i = 0; i < len; i++) {
        const stateKey = stateKeys[i];
        const newValue = committedState[stateKey];
        if (newValue !== undefined || stateKey === '*') {
          const retKeys = stateKey_retKeys_[stateKey];
          retKeys.forEach(retKey => {
            //没有挑过的方法才挑出来
            if (!retKey_picked_[retKey]) {
              pickedRetKeys.push(retKey);
              retKey_picked_[retKey] = true;
              pickedFns.push({ retKey, fn: retKey_fn_[retKey] });
            }
          });
        }

        if (pickedFns.length === fnCount) break;
      }

      cacheKey_retKeys_[cacheKey] = pickedRetKeys;
    }
  }

  return pickedFns;
}