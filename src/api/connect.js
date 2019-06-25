import register from './register';

/**
 * 
 * @param {*} ccClassKey 
 * @param {object} connectSpec { [module:string]: value: string[] | '*' }
 * @param {object} option 
 * @param {boolean} [option.isPropsProxy] default is false
 * @param {boolean} [option.isSingle] default is false
 * @param {boolean} [option.asyncLifecycleHook] 
 * @param {string} [option.module]
 * @param {Array<string>} [option.sharedStateKeys]
 */
export default function (ccClassKey, connectSpec, option = {}) {
  const mergedOption = Object.assign({ connect: connectSpec }, option);
  return register(ccClassKey, mergedOption);
}