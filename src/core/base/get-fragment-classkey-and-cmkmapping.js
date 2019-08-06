
import ccContext from '../../cc-context';
import getFeatureStrAndCmkMapping from './get-feature-str-and-cmkmapping';
import * as util from '../../support/util';
import { MODULE_DEFAULT, CC_PREFIX } from '../../support/constant';

const { featureStr_classKey_ } = ccContext;
const errCcClassKey =  classKey => new Error(`classKey[${classKey}] is already declared before`);
const NO_OTHER_SPEC = 'nos';

function checkClassKey(classKey, featureStr, connectedModuleNames, connectedModuleKeyMapping) {
  let ccClassKey = featureStr_classKey_[featureStr];
  if (ccClassKey) {
    // 如果显式的指定了classKey，相同的connect对象，必需指定相同的classKey
    if (ccClassKey !== classKey) {
      throw errCcClassKey(classKey);
    }
  } else {
    ccClassKey = featureStr_classKey_[featureStr] = classKey;
  }

  return { ccClassKey, connectedModuleNames, connectedModuleKeyMapping };
}

/**
 * 根据connect参数动态的把CcFragment、CcHookFragment 划为某个ccClassKey的实例，同时计算出stateToPropMapping值
 * 
 * 允许，相同connect，相同module的registerDumb调用指定同样的classKey
 * 
 * @param connectSpec 形如: {foo:'*', bar:['b1', 'b2']}
 */
export default function (connectSpec, fragmentModule, fragmentPrefix, watchedKeys, classKey='') {
  const { featureStr, connectedModuleKeyMapping, connectedModuleNames } = getFeatureStrAndCmkMapping(connectSpec, fragmentModule, fragmentPrefix, watchedKeys);

  if (classKey.startsWith(CC_PREFIX)) {//严格校验用户传入了classKey
    throw new Error(`user can not specify a classKey[${ccClassKey}] starts with $$Cc`);
  }

  //代表没有connect到store任何模块的CcFragment，也没有指定具体属于哪个模块
  if (!util.isObjectNotNull(connectSpec) && fragmentModule === MODULE_DEFAULT) {
    if (classKey) {
      return checkClassKey(classKey, NO_OTHER_SPEC, connectedModuleNames, connectedModuleKeyMapping);
    }

    return { ccClassKey: `${fragmentPrefix}_0`, connectedModuleKeyMapping: null };
  }

  let ccClassKey = featureStr_classKey_[featureStr];
  if (ccClassKey) {
    return { ccClassKey, connectedModuleKeyMapping, connectedModuleNames };
  } else {
    const oldFragmentNameCount = ccContext.fragmentNameCount;
    const fragmentNameCount = oldFragmentNameCount + 1;
    ccContext.fragmentNameCount = fragmentNameCount;
    ccClassKey = `${fragmentPrefix}_${fragmentNameCount}`;
    featureStr_classKey_[featureStr] = ccClassKey;
    return { ccClassKey, connectedModuleKeyMapping, connectedModuleNames };
  }
}