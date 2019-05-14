import mapSharedKeyToGlobal from './map-shared-key-to-global';
import util from '../../support/util';

export default function (moduleName, moduleSharedKeyToGlobalKeyConfig) {
  const sharedKeys = Object.keys(moduleSharedKeyToGlobalKeyConfig);
  const sLen = sharedKeys.length;
  for (let k = 0; k < sLen; k++) {
    const sharedKey = sharedKeys[k];
    const globalMappingKey = moduleSharedKeyToGlobalKeyConfig[sharedKey];
    if (typeof globalMappingKey !== 'string') {
      throw new Error(`globalMappingKey type error, is must be string, check your sharedToGlobalMapping! ${util.verboseInfo(`module:${moduleName}, sharedKey:${sharedKey}`)}`);
    }
    mapSharedKeyToGlobal(moduleName, sharedKey, globalMappingKey);
  }
}