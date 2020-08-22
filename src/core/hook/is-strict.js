let firstCall = true;
let isStrictMode = false;

export default function (cursor) {
  // 首次调用，即可确认是不是严格模式了
  if (firstCall) {
    firstCall = false;
    isStrictMode = cursor % 2 === 0;
  }

  return isStrictMode;
}
