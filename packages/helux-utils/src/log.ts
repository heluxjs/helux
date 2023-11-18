import { GLOBAL_REF } from './cst';
import { isDebug } from './is';

export function tryAlert(err: any, throwErr = false, customLabel = '') {
  let errMsg = err;
  let isErr = false;
  if (err instanceof Error) {
    isErr = true;
    errMsg = err.message;
  }
  if (isDebug()) {
    err && GLOBAL_REF.alert?.(`${customLabel}${errMsg}, see details in console.`);
  }
  console.error(err);
  if (throwErr) {
    throw isErr ? err : new Error(String(err));
  }
}

export function warn(msg: string, level = 0) {
  if (level === 0) {
    console.error(msg);
    isDebug() && console.trace(msg);
  } else if (level === 1) {
    console.error(msg);
  } else {
    console.warn(msg);
  }
}
