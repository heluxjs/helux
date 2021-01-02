import getComputed from './get-computed';
import ccContext from '../cc-context';
import { okeys } from '../support/util';

function getOneModuleCu(moduleName) {
  const moduleCuRaw = ccContext.computed._computedRaw[moduleName];
  const map = {};
  if (!moduleCuRaw) return map;

  const cuKeys = okeys(moduleCuRaw);
  cuKeys.forEach(key => map[key] = getComputed(moduleName)[key]);
  return map;
}

export default function (moduleName) {
  if (moduleName) return getOneModuleCu(moduleName);

  const allModules = okeys(ccContext.store._state);
  const map = {};
  allModules.forEach(key => map[key] = getOneModuleCu(key));
  return map;
}
