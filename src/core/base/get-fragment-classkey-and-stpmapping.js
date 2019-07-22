
import ccContext from '../../cc-context';
import getFeatureStrAndStpMapping from './get-feature-str-and-stpmapping';
import * as util from '../../support/util';
import { MODULE_DEFAULT } from '../../support/constant';

const { fragmentFeature_classKey_ } = ccContext;

/**
 * 根据connect参数动态的把CcFragment、CcHookFragment 划为某个ccClassKey的实例，同时计算出stateToPropMapping值
 * @param connectSpec 形如: {foo:'*', bar:['b1', 'b2']}
 */
export default function(connectSpec, fragmentModule, fragmentPrefix, watchedKeys) {
  //代表没有connect到store任何模块的CcFragment，也没有指定具体属于哪个模块
  if (!util.isObjectNotNull(connectSpec) && fragmentModule === MODULE_DEFAULT) {
    return { ccClassKey: `${fragmentPrefix}_0`, stateToPropMapping: null };
  }

  const { featureStr, stateToPropMapping, connectedModuleNames } = getFeatureStrAndStpMapping(connectSpec, fragmentModule, watchedKeys);
  let ccClassKey = fragmentFeature_classKey_[featureStr];
  if (ccClassKey) {
    return { ccClassKey, stateToPropMapping, connectedModuleNames };
  } else {
    const oldFragmentNameCount = ccContext.fragmentNameCount;
    const fragmentNameCount = oldFragmentNameCount + 1;
    ccContext.fragmentNameCount = fragmentNameCount;
    ccClassKey = `${fragmentPrefix}_${fragmentNameCount}`;
    fragmentFeature_classKey_[featureStr] = ccClassKey;
    return { ccClassKey, stateToPropMapping, connectedModuleNames };
  }
}