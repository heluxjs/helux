import ccContext from '../../cc-context';
import util from '../../support/util';
var _state = ccContext.store._state;
/**
 * 根据connect参数算出ccClassKey值和stateToPropMapping值
 */

export default function getFeatureStrAndStpMapping(connectSpec) {
  if (!util.isPlainJsonObject(connectSpec)) {
    throw new Error("CcFragment or CcClass's prop connect type error, it is not a plain json object");
  }

  var invalidConnect = "CcFragment or CcClass's prop connect is invalid,";

  var invalidConnectItem = function invalidConnectItem(m) {
    return invalidConnect + " module[" + m + "]'s value must be * or array of string";
  };

  var moduleNames = Object.keys(connectSpec);
  moduleNames.sort();
  var featureStrs = [];
  var stateToPropMapping = {};
  moduleNames.forEach(function (m) {
    var moduleState = _state[m];
    var feature = m + "/";

    if (moduleState === undefined) {
      throw new Error(invalidConnect + " module[" + m + "] not found in cc store ");
    }

    var val = connectSpec[m];

    if (typeof val === 'string') {
      if (val !== '*') throw new Error(invalidConnectItem(m));else {
        featureStrs.push(feature + "*");
        Object.keys(moduleState).forEach(function (sKey) {
          return stateToPropMapping[m + "/" + sKey] = sKey;
        });
      }
    } else if (!Array.isArray(val)) {
      throw new Error(invalidConnectItem(m));
    } else {
      val.forEach(function (sKey) {
        if (!moduleState.hasOwnProperty(sKey)) {
          throw new Error(invalidConnect + " module[" + m + "]'s key[" + sKey + "] not declared in cc store ");
        } else {
          feature += sKey + ",";
          stateToPropMapping[m + "/" + sKey] = sKey;
        }
      });
      featureStrs.push(feature);
    }
  });
  return {
    featureStr: featureStrs.join('|'),
    stateToPropMapping: stateToPropMapping
  };
}