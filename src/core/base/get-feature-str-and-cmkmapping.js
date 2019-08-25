import ccContext from '../../cc-context';
import util, { okeys } from '../../support/util';

const { store: { _state } } = ccContext;

/**
 * 根据connect参数算出ccClassKey值和connectedModuleKeyMapping值
 */
export default function(connectSpec, fragmentModule, fragmentPrefix, watchedKeys) {
  if (!util.isPlainJsonObject(connectSpec)) {
    throw new Error(`CcFragment or CcClass's prop connect type error, it is not a plain json object`);
  }

  const invalidConnect = `CcFragment or CcClass's prop connect is invalid,`;
  const invalidConnectItem = m => `${invalidConnect} module[${m}]'s value must be * or array of string`;

  const moduleNames = okeys(connectSpec);
  moduleNames.sort();
  const featureStrs = [];
  const connectedModuleKeyMapping = {};

  moduleNames.forEach(m => {
    const moduleState = _state[m];
    let feature = `${fragmentPrefix}_${m}/`;

    if (moduleState === undefined) {
      throw new Error(`${invalidConnect} module[${m}] not found in cc store `);
    }
    const val = connectSpec[m];

    if (typeof val === 'string') {
      if (val !== '*') throw new Error(invalidConnectItem(m));
      else {
        featureStrs.push(`${feature}*`);
        okeys(moduleState).forEach(sKey => connectedModuleKeyMapping[`${m}/${sKey}`] = sKey);
      }
    } else if (!Array.isArray(val)) {
      throw new Error(invalidConnectItem(m));
    } else {
      val.forEach(sKey => {
        if (!moduleState.hasOwnProperty(sKey)) {
          throw new Error(`${invalidConnect} module[${m}]'s key[${sKey}] not declared in cc store `);
        } else {
          feature += `${sKey},`;
          connectedModuleKeyMapping[`${m}/${sKey}`] = sKey;
        }
      });
      featureStrs.push(feature);
    }
  });

  if (fragmentModule) {
    if (watchedKeys === '*') featureStrs.unshift(`${fragmentPrefix}_$${fragmentModule}/*`);
    else {
      watchedKeys.sort();
      const tmpStr = `${fragmentModule}/` + watchedKeys.join(',');
      featureStrs.unshift(tmpStr);
    }
  }

  return { featureStr: featureStrs.join('|'), connectedModuleKeyMapping, connectedModuleNames: moduleNames };
}