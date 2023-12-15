import { tryAlert } from '@helux/utils';
import { REACTIVE_META_KEY } from '../../consts';
import { getInternal, getInternalByKey } from '../../helpers/state';
import type { SharedState } from '../../types/base';
import type { IReactiveMeta } from '../../types/inner';
import type { TInternal } from '../creator/buildInternal';

interface ICheckSharedOptionsBase {
  /**
   * default: undefined，检查传入对象是否是 atom，
   * undefined 表示不检查，
   * true 检查传入对象必须是 atom，
   * false 检查传入对象必须非 atom
   */
  forAtom?: boolean;
  label?: string;
}

interface ICheckSharedOptions extends ICheckSharedOptionsBase {
  /**
   * default: false，是否严格检查 internal 必须存在，
   * true，严格检查 internal，不存在则报错
   * false，不严格检查，不存在返回 null
   */
  strict?: boolean;
}

export function checkShared<T = SharedState | number>(sharedStateOrKey: T, options?: ICheckSharedOptions): TInternal | null {
  const { forAtom, label, strict = false } = options || {};
  let internal: TInternal;
  if (typeof sharedStateOrKey === 'number') {
    internal = getInternalByKey(sharedStateOrKey);
  } else {
    internal = getInternal(sharedStateOrKey);
  }
  // 猜测传入的是 reactive 对象
  if (!internal && sharedStateOrKey) {
    const rMeta: IReactiveMeta = (sharedStateOrKey as any)[REACTIVE_META_KEY];
    internal = getInternalByKey(rMeta?.sharedKey);
  }

  let prefix = label ? `[[${label}]] err:` : 'err:';

  if (!internal) {
    if (strict) {
      tryAlert(`${prefix} not a valid shared or atom`, { throwErr: true });
    } else {
      return null;
    }
  }

  // 传递了具体的 forAtom 布尔值，才严格校验是否是 atom 或 shared
  if (forAtom !== undefined) {
    if (forAtom && !internal.forAtom) {
      tryAlert(`${prefix} expect a shared but recived a atom`, { throwErr: true });
    }
    if (!forAtom && internal.forAtom) {
      tryAlert(`${prefix} expect a atom but recived a shared`, { throwErr: true });
    }
  }
  return internal;
}

/**
 * 不抛错误的话，一定返回 internal
 */
export function checkSharedStrict<T = SharedState | number>(sharedStateOrKey: T, options?: ICheckSharedOptionsBase): TInternal {
  return checkShared(sharedStateOrKey, { ...(options || {}), strict: true }) as TInternal;
}
