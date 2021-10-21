let isStrictMode = false;

const locMsgs = {
  1: '',
  2: '',
};

export function recordFirst2HookCallLoc(cursor, msg) {
  locMsgs[cursor] = msg;
  if (cursor === 2 && locMsgs[1] === locMsgs[2]) {
    isStrictMode = true;
  }
}

export default function () {
  return isStrictMode;
}
