### type utils

```ts
/** share 返回的共享对象， draftRoot 和 draft 相等，atom 返回的共享对象， draftRoot = { val: draft } */
export type DraftRootType<T = SharedState> = T extends Atom | ReadOnlyAtom ? AtomDraft<T> : T;

/** share 返回的共享对象， draftRoot 和 draft 相等，atom 返回的共享对象， draftRoot = { val: draft } */
export type DraftType<T = SharedState> = T extends Atom | ReadOnlyAtom ? AtomDraftVal<T> : T;

export type StateRootType<T = SharedState> = T extends Atom | ReadOnlyAtom ? ReadOnlyAtom<T> : ReadOnlyDict<T>;

export type StateType<T = SharedState> = T extends Atom | ReadOnlyAtom ? ReadOnlyAtomVal<T> : ReadOnlyDict<T>;

/** partial state or cb */
export type PartialArgType<T> = T extends PlainObject ? Partial<T> | ((draft: T) => void | Partial<T>) : T | ((draft: T) => void | T);
```

## to del

```ts
AtomSyncFnBuilder;
AtomSyncer;
```
