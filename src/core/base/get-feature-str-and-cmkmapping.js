import ccContext from '../../cc-context';
import * as util from '../../support/util';
import { NOT_A_JSON } from '../../support/priv-constant';

const { okeys, isPJO } = util;
const { store: { _state } } = ccContext;

const hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * 根据connect,watchedKeys算出ccClassKey值和connectedModuleKeyMapping值
 */
export default function(connectSpec, watchedKeys, belongModule, compTypePrefix) {
  if (!isPJO(connectSpec)) {
    throw new Error(`CcFragment or CcClass's prop connect type error, it ${NOT_A_JSON}`);
  }

  const invalidConnect = `CcFragment or CcClass's prop connect is invalid,`;
  const invalidConnectItem = m => `${invalidConnect} module[${m}]'s value must be * or array of string`;

  const moduleNames = okeys(connectSpec);
  moduleNames.sort();
  const featureStrs = [];
  const connectedModuleKeyMapping = {};

  moduleNames.forEach(m => {
    const moduleState = _state[m];
    let feature = `${compTypePrefix}_${m}/`;

    if (moduleState === undefined) {
      throw new Error(`${invalidConnect} module[${m}] not found in cc store `);
    }
    const val = connectSpec[m];

    if (typeof val === 'string') {
      if (val !== '*' && val !== '-') throw new Error(invalidConnectItem(m));
      else {
        featureStrs.push(`${feature}*`);
        okeys(moduleState).forEach(sKey => connectedModuleKeyMapping[`${m}/${sKey}`] = sKey);
      }
    } else if (!Array.isArray(val)) {
      throw new Error(invalidConnectItem(m));
    } else {
      val.forEach(sKey => {
        if (!hasOwnProperty.call(moduleState, sKey)) {
          throw new Error(`${invalidConnect} module[${m}]'s key[${sKey}] not declared in cc store `);
        } else {
          feature += `${sKey},`;
          connectedModuleKeyMapping[`${m}/${sKey}`] = sKey;
        }
      });
      featureStrs.push(feature);
    }
  });

  featureStrs.push('|');// 之后是watchKeys相关的特征值参数
  if (watchedKeys === '*') featureStrs.push(`${compTypePrefix}_$${belongModule}/*`);
  else {
    watchedKeys.sort();
    const tmpStr = `${belongModule}/` + watchedKeys.join(',');
    featureStrs.push(tmpStr);
  }

  return { featureStr: featureStrs.join('@'), connectedModuleKeyMapping, connectedModuleNames: moduleNames };
}