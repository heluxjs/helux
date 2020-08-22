
const key_findResult_ = {
};


export function createModuleNode(moduleName){
  key_findResult_[moduleName] = {};
}

export function getCacheKey(moduleName, sharedStateKeys, renderKeys, renderKeyClasses = []) {
  const renderKeyStr = renderKeys ? renderKeys.join(',') : '';
  const featureStr1 = sharedStateKeys.sort().join(',');
  const featureStr2 = renderKeyClasses === '*' ? '*' : renderKeyClasses.sort().join(',');
  return `${moduleName}/${featureStr1}/${renderKeyStr}/${featureStr2}`;
}

export function getCache(moduleName, key) {
  return key_findResult_[moduleName][key];
}

export function setCache(moduleName, key, result) {
  key_findResult_[moduleName][key] = result;
}
