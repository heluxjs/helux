

const connectToStr = (connect) => {
  if (!connect) return '';
  else if (Array.isArray(connect)) return connect.join(',');
  else if (typeof connect === 'object') return JSON.stringify(connect);
  else return connect;
}

export function isRegChanged(firstRegOpt, curRegOpt) {
  if (firstRegOpt.module !== curRegOpt.module) {
    return true;
  }
  if (connectToStr(firstRegOpt.connect) !== connectToStr(curRegOpt.connect)) {
    return true;
  }
  if (firstRegOpt.tag !== curRegOpt.tag) {
    return true;
  }

  return false;
}
