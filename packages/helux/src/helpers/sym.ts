let symbolSeed = 0;

export function createSymbol(str: string) {
  if (typeof Symbol === 'function') {
    return Symbol(str);
  }

  symbolSeed += 1;
  return `__SHARED_KEY__${symbolSeed}`;
}
