
let seed = 0;

/**
 * get num seed
 */
export function getSeed() {
  seed += 1;
  return seed;
}

export function getLocaleTime(date?: Date) {
  const d = date || new Date();
  const str1 = d.toLocaleString();
  const str2 = `${d.getTime()}`.substring(10);
  return `${str1} ${str2}`;
}

export function getAtionFns(actions: any, otherActions?: any[]) {
  const fns = Object.keys(actions).map(key => actions[key]);
  return fns.concat(otherActions || []);
}

export function noop(...args: any[]) { }

export function random(seed = 100) {
  return Math.ceil(Math.random() * seed);
}

export function randomStr(length = 8) {
  let str = '';
  let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let i = 0; i < length; i++) {
    str += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return str;
}

export const delay = (ms = 2000) => new Promise(r => setTimeout(r, ms));

export function log(label: string, ...args: any[]) {
  logColor(label, 'blue', ...args);
}

export function logColor(label: string, color: string, ...args: any[]) {
  console.log(`%c ${label}`, `color:${color}`, ...args)
}

export function logRed(label: string, ...args: any[]) {
  logColor(label, 'red', ...args);
}

export function nodupPush(list: Array<string | number>, toPush: string | number) {
  if (!list.includes(toPush)) list.push(toPush);
}

export function timemark() {
  const date = new Date();
  const str = date.toLocaleString();
  const [, timeStr] = str.split(' ');
  const ms = date.getMilliseconds();
  return `${timeStr} ${ms}`;
}

export function bindToWindow(obj: any) {
  // @ts-ignore
  if (!window.see) window.see = {};
  // @ts-ignore
  Object.assign(window.see, obj);
}

export function dictFactory() {
  return {
    loading: false,
    a: {
      b: { c: 1 },
      b1: { c1: 1 },
    },
    info: { name: 'helux', age: 1 },
    desc: 'awesome lib',
    extra: {
      mark: 'extra',
      toBeDrive: 0,
      prefixedMark: '',
      newName: '',
    },
    f: 1,
    g: 1,
  };
}
