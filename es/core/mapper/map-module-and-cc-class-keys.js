import util from '../../support/util';
import ccContext from '../../cc-context';

const {
  moduleName_ccClassKeys_, moduleSingleClass
} = ccContext;

export default function (moduleName, ccClassKey) {
  const ccClassKeys = util.safeGetArrayFromObject(moduleName_ccClassKeys_, moduleName);

  if (moduleSingleClass[moduleName] === true && ccClassKeys.length >= 1) {
    throw new Error(`module[${moduleName}] is declared as single, only on ccClassKey can been registered to it, and now a ccClassKey[${ccClassKeys[0]}] has been registered!`);
  }

  if (!ccClassKeys.includes(ccClassKey)) ccClassKeys.push(ccClassKey);
}