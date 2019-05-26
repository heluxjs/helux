import ccContext from '../../cc-context';
import util from '../../support/util';

const { store: { _state } } = ccContext;

/**
 * 根据connect参数算出ccClassKey值和stateToPropMapping值
 */
export default function getFeatureStrAndStpMapping(connectSpec) {
  if(!util.isPlainJsonObject(connectSpec)){
    throw new Error(`CcFragment or CcClass's prop connect type error, it is not a plain json object`);
  }

  const invalidConnect = `CcFragment or CcClass's prop connect is invalid,`;
  const invalidConnectItem = m => `${invalidConnect} module[${m}]'s value must be * or array of string`;

  const moduleNames = Object.keys(connectSpec);
  moduleNames.sort();
  const featureStrs = [];
  const stateToPropMapping = {};

  moduleNames.forEach(m => {
    const moduleState = _state[m];
    let feature = `${m}/`;

    if (moduleState === undefined) {
      throw new Error(`${invalidConnect} module[${m}] not found in cc store `);
    }
    const val = connectSpec[m];

    if (typeof val === 'string') {
      if (val !== '*') throw new Error(invalidConnectItem(m));
      else {
        featureStrs.push(`${feature}*`);
        Object.keys(moduleState).forEach(sKey => stateToPropMapping[`${m}/${sKey}`] = sKey);
      }
    } else if (!Array.isArray(val)) {
      throw new Error(invalidConnectItem(m));
    } else {
      val.forEach(sKey => {
        if (!moduleState.hasOwnProperty(sKey)) {
          throw new Error(`${invalidConnect} module[${m}]'s key[${sKey}] not declared in cc store `);
        } else {
          feature += `${sKey},`;
          stateToPropMapping[`${m}/${sKey}`] = sKey;
        }
      });
      featureStrs.push(feature);
    }
  });

  return { featureStr: featureStrs.join('|'), stateToPropMapping };
}