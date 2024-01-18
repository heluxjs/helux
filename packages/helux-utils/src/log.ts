import { GLOBAL_REF } from './cst';
import { isDebug } from './is';

interface IAlertOpts {
  /** default: false，是否抛出错误 */
  throwErr?: boolean;
  /** default: ''，定制的提示信息前缀 */
  prefixLabel?: string;
  /** default: ''，定制的提示信息后缀 */
  suffixLabel?: string;
  /** default: true，是否打印错误，*/
  logErr?: boolean;
  /** default: undefined，是否弹层显示错误，未指定时走内置规则：开发环境弹，生成环境不弹 */
  alertErr?: boolean;
}

export function tryAlert(err: any, options?: IAlertOpts) {
  const { throwErr = false, prefixLabel = '', suffixLabel = ', see details in console.', logErr = true, alertErr } = options || {};
  let errMsg = err;
  let isErr = false;
  if (err instanceof Error) {
    isErr = true;
    errMsg = err.message;
  }

  // 还原为老写法（ 无 ?? 和 ?. ），防止某些版本 babel 编译报错
  const canAlert = typeof alertErr === 'boolean' ? alertErr : isDebug();
  if (canAlert && GLOBAL_REF.alert) {
    err && GLOBAL_REF.alert(`${prefixLabel}${errMsg}${suffixLabel}`);
  }
  logErr && console.error(err);
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
