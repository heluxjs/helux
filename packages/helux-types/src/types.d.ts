export type NumStr = number | string;

export type NumStrSymbol = number | string | symbol;

export type Dict<T = any> = Record<NumStrSymbol, T>;

export type PlainObject = Record<string, {}>;

export type Fn<T = any> = (...args: any[]) => T;

export type FnVoid = (...args: any[]) => void;

export type PartialStateCb<T = Dict> = (prev: T) => Partial<T> | void;

export type ChangeDraftCb<T = Dict> = (mutableDraft: T) => Partial<T> | void;
