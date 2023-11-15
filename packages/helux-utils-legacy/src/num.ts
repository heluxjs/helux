import { isMax } from './is';

export function getSafeNext(input: number) {
  const num = isMax(input) ? 1 : input + 1;
  return num;
}
