import { ReactNode } from 'helux-types';
import { isFn, prefixValKey } from 'helux-utils';
import { IS_BLOCK } from '../consts';
import { isAtom, isDerivedAtom } from '../factory/common/atom';
import { getLastest } from '../factory/common/blockScope';
import { getSharedKey } from '../helpers/state';
import type { CoreApiCtx } from '../types/api-ctx';
import type { SingalVal } from '../types/base';
import { dynamicBlock } from './block';
import { alwaysEqual, wrapDerivedAtomSignalComp, wrapDerivedSignalComp, wrapSignalComp } from './common/wrap';

export function signal(apiCtx: CoreApiCtx, input: SingalVal | (() => SingalVal)): ReactNode {
  const { react } = apiCtx;
  if (input && (input as any)[IS_BLOCK]) {
    return react.createElement(input as any);
  }

  // for $(()=>atom), $(()=>derivdedAtom), $(()=>ReactNode)
  if (isFn(input)) {
    const Comp = dynamicBlock(apiCtx, input, { compare: alwaysEqual });
    return react.createElement(Comp);
  }

  // for $(derivdedAtom)
  if (isDerivedAtom(input)) {
    const Comp = wrapDerivedAtomSignalComp(apiCtx, input, alwaysEqual);
    return react.createElement(Comp);
  }

  // for $(atom)
  if (isAtom(input)) {
    const sharedKey = getSharedKey(input);
    const options = { sharedKey, sharedState: input, depKey: prefixValKey('val', sharedKey), keyPath: ['val'], compare: alwaysEqual };
    const Comp = wrapSignalComp(apiCtx, options);
    return react.createElement(Comp);
  }

  const readedInfo = getLastest();
  const { sharedKey, val, stateOrResult, depKey, keyPath, isDerivedResult } = readedInfo;
  if (input === val && stateOrResult) {
    // for $(atomDerived.val), user unbox atomDerived manually
    if (readedInfo.isDerivedAtom) {
      const Comp = wrapDerivedAtomSignalComp(apiCtx, stateOrResult, alwaysEqual);
      return react.createElement(Comp);
    }

    // for $(derived.xxx)
    if (isDerivedResult) {
      const Comp = wrapDerivedSignalComp(apiCtx, stateOrResult, keyPath, alwaysEqual);
      return react.createElement(Comp);
    }

    // for $(atom.val) , $(shared.xxx)
    const Comp = wrapSignalComp(apiCtx, { sharedKey, sharedState: stateOrResult, depKey, keyPath, compare: alwaysEqual });
    return react.createElement(Comp);
  }

  return input;
}
