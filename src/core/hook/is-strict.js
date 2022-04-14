let isStrictMode = false;

const locMsgs = {
  1: '',
  2: '',
};

function isLocEqual() {
  const mark = 'atbeginWork';
  const locStr1 = locMsgs[1].replace(/ /g, '');
  const locStr2 = locMsgs[2].replace(/ /g, '');
  // 来自 react 18 影响，此处需要优化为更严格的判断
  // 截掉中间影响判断的一段，以 atbeginWork 为标记，向左找到第二个分号位置，作为截取参数
  // react-dom.development.js:20909:19)\natbeginWork
  // react-dom.development.js:20838:13)\natbeginWork
  const find2ndSemicolonIdx = (str, startIndex) => {
    let targetIdx = startIndex;
    let semicolonCount = 0;
    for (let tmpIdx = startIndex; tmpIdx >= 0; tmpIdx--) {
      const char = str[tmpIdx];
      if (char === ':') {
        semicolonCount++;
      }
      if (semicolonCount === 2) {
        targetIdx = tmpIdx;
        break;
      }
    }
    return targetIdx;
  };

  const markIdx1 = locStr1.indexOf(mark);
  const markIdx2 = locStr2.indexOf(mark);
  const semi1 = find2ndSemicolonIdx(locStr1, markIdx1);
  const semi2 = find2ndSemicolonIdx(locStr2, markIdx2);
  const newLocStr1 = `${locStr1.substr(0, semi1)}${locStr1.substr(markIdx1)}`;
  const newLocStr2 = `${locStr2.substr(0, semi2)}${locStr2.substr(markIdx2)}`;
  return newLocStr1 === newLocStr2;
}

export function recordFirst2HookCallLoc(cursor, msg) {
  locMsgs[cursor] = msg;
  if (cursor === 2 && isLocEqual()) {
    isStrictMode = true;
  }
}

export default function () {
  return isStrictMode;
}
