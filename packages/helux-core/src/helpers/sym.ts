let symbolSeed = 0;
const NativeSym = Symbol;
export const HAS_SYMBOL = typeof NativeSym === 'function';

export function createSymbol(str: string) {
  if (HAS_SYMBOL) {
    return NativeSym(str);
  }

  symbolSeed += 1;
  return `__SHARED_KEY__${symbolSeed}`;
}
