import { GLOBAL_REF } from './cst';
import { isDebug } from './is';

export function tryAlert(err: any, throwErr = false, customLabel = '') {
  let label = err;
  let isErr = false;
  if (isDebug()) {
    if (err instanceof Error) {
      isErr = true;
      label = err.message;
    }
    err && GLOBAL_REF.alert?.(`${customLabel || label}, see details in console.`);
  }
  if (isErr && customLabel) {
    err.message = `${customLabel}`;
  }
  console.error(err);
  if (throwErr) {
    throw isErr ? err : new Error(label);
  }
}

export function tryWarn(err: any) {
  console.error(err);
}

export function warn(msg: string) {
  console.warn?.(msg);
}
