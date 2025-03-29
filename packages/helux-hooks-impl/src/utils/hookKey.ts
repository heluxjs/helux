export const KEY_COUNT = new Map<string, number>();

let isDev: boolean = false;

try {
  isDev = process.env.NODE_ENV === 'development';
} catch (err) {
  // silent here
  console.log('ignored err:', err);
}

// @ts-ignore log helux associate params
if (globalThis.__LOG_HP__) {
  console.log('isDev', isDev);
}

function addCount(key: string) {
  if (!KEY_COUNT.get(key)) {
    KEY_COUNT.set(key, 1);
    return;
  }
  KEY_COUNT.set(key, 2);
}

function getKey(err: any) {
  const list = err.stack.split('\n');
  let key = '';
  for (const item of list) {
    // 双调用的第二次错误信息堆栈里 renderWithHooks 之后的信息都不一样，需从这里开始断掉，
    if (item.includes('renderWithHooks')) {
      break;
    }
    key += item;
  }
  return key;
}

export function getHookKey() {
  if (!isDev) {
    return '';
  }

  let key = '';
  try {
    // @see https://jsperf.app/try-catch-performance-jls/2
    throw new Error('hook key');
  } catch (err: any) {
    key = getKey(err);
    addCount(key);
  }
  return key;
}

export function isHookUnderStrictMode(key: string) {
  if (!isDev) {
    return false;
  }

  return KEY_COUNT.get(key) === 2;
}
