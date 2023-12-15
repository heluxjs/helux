import { IS_ATOM, IS_DERIVED_ATOM } from '../../consts';
import { Atom, AtomValType, DerivedAtom } from '../../types/base';

export function isAtom(mayAtom: any): mayAtom is Atom {
  if (!mayAtom) {
    return false;
  }
  return mayAtom[IS_ATOM] ?? false;
}

export function isDerivedAtom(mayAtomDerived: any): mayAtomDerived is DerivedAtom {
  if (!mayAtomDerived) {
    return false;
  }
  return mayAtomDerived[IS_DERIVED_ATOM] || false;
}

export function getAtom<T extends any = any>(mayAtom: T): AtomValType<T> {
  if (isAtom(mayAtom) || isDerivedAtom(mayAtom)) {
    return mayAtom.val;
  }
  // @ts-ignore trust AtomValType unbox type operation
  return mayAtom;
}
