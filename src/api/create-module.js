/** @typedef {import('../types').ModuleConfig} ModuleTemplate */
/** @typedef {import('../types').RegisteredModule} RegisteredModule */
import configure from '../api/configure';
import { REG_MODULE_KEY, ALCC_KEY } from '../support/priv-constant';
import getModuleName from '../core/param/get-module-name';

/**
 * 调用 configure 配置模块模板，并返回已注册模块
 * @param {ModuleTemplate} moduleTemplate 
 * @param {string} moduleNameOrTag 
 * @param {boolean} asTag 
 * @return {RegisteredModule}
 */
export default function (moduleTemplate, moduleNameOrTag, asTag = false) {
  const finalModuleName = getModuleName(moduleNameOrTag, asTag);
  const allowCcPrefixFlag = asTag === true ? 1 : 0;
  configure(finalModuleName, moduleTemplate, { [ALCC_KEY]: allowCcPrefixFlag });
  const registeredModule = Object.assign({}, moduleTemplate, { __regModule__: finalModuleName, [REG_MODULE_KEY]: 1 });
  return registeredModule;
}
