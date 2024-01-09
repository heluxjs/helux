import type { Fn, NumStrSymbol } from '@helux/types';

export function nodupPush(list: NumStrSymbol[], toPush: NumStrSymbol) {
  if (!list.includes(toPush)) list.push(toPush);
}

export function delListItem(list: NumStrSymbol[], toDel: NumStrSymbol) {
  const idx = list.indexOf(toDel);
  if (idx >= 0) {
    list.splice(idx, 1);
  }
}

export function dedupList(list: Array<any>) {
  return Array.from(new Set(list));
}

export function includeOne(loopList: any[], judgeList: any[]) {
  let ret = false;
  for (const item of loopList) {
    if (judgeList.includes(item)) {
      // 包含有外层list的一项，就结束循环
      ret = true;
      break;
    }
  }
  return ret;
}

export function matchListItem(list: string[], fullStr: string) {
  let matchKey = '';
  const len = list.length;
  for (let i = 0; i < len; i++) {
    const item = list[i];
    if (fullStr.startsWith(item)) {
      matchKey = item;
      break;
    }
  }
  return matchKey;
}

export function enureReturnArr(fn?: Fn, arg1?: any, arg2?: any) {
  if (!fn) return [];
  const result = fn(arg1, arg2);
  return Array.isArray(result) ? result : [result];
}
