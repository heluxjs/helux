import { okeys } from '../../support/util';

export default function (refCtx, item, handler, fns, immediateKeys) {
  const itype = typeof item;
  if (itype === 'object') {
    if (Array.isArray(item)) {
      // handler._fnName = getFnName();//给函数标记一个名词，方便后面触发trigger时使用
      throw new Error('not support multi keys currently');
    } else {
      okeys(item).forEach(key => fns[key] = item[key]);
    }
  } else if (itype === 'function') {
    const ret = item(refCtx);
    if (typeof ret === 'object') {
      okeys(ret).forEach(key => fns[key] = ret[key]);
    }
  } else if (itype === 'string') {
    const key = item;
    fns[key] = handler;
    if (immediateKeys) immediateKeys.push(key);
  }
};