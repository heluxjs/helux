import * as util from '../../support/util';

const { okeys } = util;

/**
 * 根据connect,watchedKeys,以及用户提供的原始renderKeyClasses 计算 特征值
 */
export default function (belongModule, connectSpec, renderKeyClasses) {
  const moduleNames = okeys(connectSpec);
  moduleNames.sort();

  let classesStr;
  if (renderKeyClasses === '*') classesStr = '*';
  else classesStr = renderKeyClasses.slice().join(',');

  return `${belongModule}/${moduleNames.join(',')}/${classesStr}`;
}
