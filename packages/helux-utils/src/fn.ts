// @ts-nocheck

export function noop(...args: any[]): undefined {}

export const noopVoid: (...args: any[]) => void = noop;

export function noopArgs<T extends any[] = any[]>(...args: T): T {
  return args;
}

export function noopArr(...args: any[]): any[] {
  return [];
}
