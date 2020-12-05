import getComputed from './get-computed';
import ccContext from '../cc-context';
import { okeys } from '../support/util';

export default function (moduleName) {
  const module2cuRaw = ccContext.computed._computedRaw;
  const cuKeys = okeys(module2cuRaw[moduleName]);
  const map = {};
  cuKeys.forEach(key => map[key] = getComputed(moduleName)[key]);
  return map;
}
