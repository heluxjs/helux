import register from './register';

/**
 * 
 * @param {*} ccClassKey 
 * @param {object} stateToPropMapping { (moduleAndStateKey): (mappedStateKeyInPropState) }
 * @param {object} option 
 * @param {boolean} [option.extendInputClass] default is true
 * @param {boolean} [option.isSingle] default is false
 * @param {boolean} [option.isPropStateModuleMode] 
 * @param {boolean} [option.asyncLifecycleHook] 
 * @param {string} [option.module]
 * @param {Array<string>} [option.sharedStateKeys]
 * @param {Array<string>} [option.globalStateKeys]
 */
export default function (ccClassKey, stateToPropMapping, option = {}) {
  const mergedOption = Object.assign({ isPropStateModuleMode: true }, option, { stateToPropMapping });
  return register(ccClassKey, mergedOption);
}