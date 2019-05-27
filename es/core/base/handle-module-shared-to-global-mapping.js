import mapSharedKeyToGlobal from '../mapper/map-shared-key-to-global';
import util from '../../support/util';
export default function (moduleName, moduleSharedKeyToGlobalKeyConfig) {
  var sharedKeys = Object.keys(moduleSharedKeyToGlobalKeyConfig);
  var sLen = sharedKeys.length;

  for (var k = 0; k < sLen; k++) {
    var sharedKey = sharedKeys[k];
    var globalMappingKey = moduleSharedKeyToGlobalKeyConfig[sharedKey];

    if (typeof globalMappingKey !== 'string') {
      throw new Error("globalMappingKey type error, is must be string, check your sharedToGlobalMapping! " + util.verboseInfo("module:" + moduleName + ", sharedKey:" + sharedKey));
    }

    mapSharedKeyToGlobal(moduleName, sharedKey, globalMappingKey);
  }
}