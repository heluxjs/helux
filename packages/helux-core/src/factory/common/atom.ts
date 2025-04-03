import { IS_ATOM, IS_DERIVED_ATOM } from '../../consts';
import { Atom, AtomValType, DerivedAtom, DerivedDict } from '../../types/base';

export function isAtom(mayAtom: any): mayAtom is Atom {
  if (!mayAtom) {
    return false;
  }
  return mayAtom[IS_ATOM] ?? false;
}

export function isSharedState(mayShared: any) {
  if (!mayShared) {
    return false;
  }
  return mayShared[IS_ATOM] !== undefined;
}

/** 判断是否是 derive 函数返回的结果，true：是全量派生的 atom 结果  */
export function isDerivedAtom(mayAtomDerived: any): mayAtomDerived is DerivedAtom {
  if (!mayAtomDerived) {
    return false;
  }
  return mayAtomDerived[IS_DERIVED_ATOM] || false;
}

/** 判断是否是 derive 或 deriveDict 函数返回的结果，true：是全量派生结果，false：不是全量派生结果 */
export function isDerivedResult(mayDerived: any): mayDerived is DerivedAtom | DerivedDict {
  if (!mayDerived) {
    return false;
  }
  return mayDerived[IS_DERIVED_ATOM] !== undefined;
}

export function getAtom<T extends any = any>(mayAtom: T): AtomValType<T> {
  if (isAtom(mayAtom) || isDerivedAtom(mayAtom)) {
    return mayAtom.val;
  }
  // @ts-ignore trust AtomValType unbox type operation
  return mayAtom;
}
