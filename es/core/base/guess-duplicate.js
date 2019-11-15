import { ERR } from '../../support/constant';
import ccContext from '../../cc-context';

const keyWord = 'at Object.configure';

function getDupLocation(errStack) {
  if (!errStack) errStack = '';

  const arr = errStack.split('\n');
  const len = arr.length;
  let locationStr = '';
  for (let i = 0; i < len; i++) {
    const strPiece = arr[i];
    if (strPiece.includes(keyWord)) {
      // 这句话是具体调用configure的地方
      // "    at Object.configure (http://localhost:3001/static/js/main.chunk.js:13750:80)"
      const arr2 = strPiece.split(':');
      const lastIdx = arr2.length - 1;
      const locationStrArr = [];
      arr2.forEach((str, idx) => {
        if (idx !== lastIdx) locationStrArr.push(str);
      })
      // "    at Object.configure (http://localhost:3001/static/js/main.chunk.js:13750)"
      locationStr = locationStrArr.join(':');
      break;
    }
  }

  return locationStr;
}

const module_dupLocation_ = {

};

export default (err, module, tag) => {
  if (err.code === ERR.CC_MODULE_NAME_DUPLICATE && ccContext.isHotReloadMode()) {
    const dupLocation = getDupLocation(err.stack);
    const key = `${tag}|--link--|${module}`;
    const prevLocation = !module_dupLocation_[key];
    if (!prevLocation) {
      // 没有记录过
      module_dupLocation_[key] = dupLocation;
    } else if (dupLocation !== prevLocation) {
      throw err;
    }
  } else {
    throw err;
  }
}