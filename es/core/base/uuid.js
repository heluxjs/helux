import { randomNumber } from '../../support/util';
let _currentIndex = 0;
const letters = [
  'a', 'A', 'b', 'B', 'c', 'C', 'd', 'D', 'e', 'E', 'f', 'F', 'g', 'G',
  'h', 'H', 'i', 'I', 'j', 'J', 'k', 'K', 'l', 'L', 'm', 'M', 'n', 'N',
  'o', 'O', 'p', 'P', 'q', 'Q', 'r', 'R', 's', 'S', 't', 'T',
  'u', 'U', 'v', 'V', 'w', 'W', 'x', 'X', 'y', 'Y', 'z', 'Z',
]

function genNonceStr(length = 6) {
  let ret = '';
  for (let i = 0; i < length; i++) {
    ret += letters[randomNumber()];
  }
  return ret;
}

export default function (forFragment = false) {
  const prefix = forFragment === true ? 'CCF' : 'CC';
  _currentIndex++;
  const nonceStr = genNonceStr();
  return `${prefix}_${Date.now()}_${nonceStr}_${_currentIndex}`;
}
