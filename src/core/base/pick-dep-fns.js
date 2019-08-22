import { okeys } from '../../support/util';

export default function (depDesc, stateModule, committedState) {
  const moduleDep = depDesc[stateModule];
  const pickedFns = [];
  if (moduleDep) {
    const { stateKey_retKeys_, retKey_fn_ } = moduleDep;
    const retKey_picked_ = {};

    //从stateKey_retKeys_入手开始遍历
    okeys(stateKey_retKeys_).forEach(stateKey => {
      const newValue = committedState[stateKey];

      if (newValue !== undefined || stateKey === '*') {
        const retKeys = stateKey_retKeys_[stateKey];
        retKeys.forEach(retKey => {
          //没有挑过的方法才挑出来
          if (!retKey_picked_[retKey]) {
            retKey_picked_[retKey] = true;
            pickedFns.push({ retKey, fn: retKey_fn_[retKey] });
          }
        });
      }
    });
  }

  return pickedFns;
}