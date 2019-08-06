import { okeys } from '../../support/util';

export default function (item, handler, fns, immediateKeys) {
  const itype = typeof item;
  if (itype === 'object') {
    okeys(item).forEach(key => fns[key] = item[key]);
  } else if (itype === 'function') {
    const ret = item(this);
    if (typeof ret === 'object') {
      okeys(ret).forEach(key => fns[key] = ret[key]);
    }
  } else if (itype === 'string') {
    const key = item;
    fns[key] = handler;
    if (immediateKeys) immediateKeys.push(key);
  }
};