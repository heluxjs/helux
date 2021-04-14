import { MODULE_CC } from '../../support/constant';

let moduleNo = 1;

export default function (moduleName, asTag) {
  if (asTag === true) {
    moduleNo += 1;
    let tag = moduleName ? `_${moduleName}` : ''
    return `${MODULE_CC}_${moduleNo}${tag}`;
  }

  return moduleName;
}
