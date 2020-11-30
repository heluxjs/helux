
const key2findResult = {
};


export function createModuleNode(moduleName) {
  key2findResult[moduleName] = {};
}

export function getCacheKey(moduleName, sharedStateKeys, renderKeys, renderKeyClasses = []) {
  const renderKeyStr = renderKeys ? renderKeys.join(',') : '';
  const featureStr1 = sharedStateKeys.sort().join(',');
  const featureStr2 = renderKeyClasses === '*' ? '*' : renderKeyClasses.sort().join(',');
  return `${moduleName}/${featureStr1}/${renderKeyStr}/${featureStr2}`;
}

export function getCache(moduleName, key) {
  return key2findResult[moduleName][key];
}

export function setCache(moduleName, key, result) {
  key2findResult[moduleName][key] = result;
}
