import type { Dict, Fn } from '../types';
import { canUseProxy, isFn } from '../utils';

function setProtoOf(obj: Dict, proto: any) {
  obj.__proto__ = proto;
  return obj;
}

function mixinProperties(obj: Dict, proto: any) {
  for (var prop in proto) {
    if (!Object.prototype.hasOwnProperty.call(obj, prop)) {
      obj[prop] = proto[prop];
    }
  }
  return obj;
}

// inspired by  https://github.com/wesleytodd/setprototypeof
/* eslint no-proto: 0 */
const setProto = Object.setPrototypeOf || ({ __proto__: [] } instanceof Array ? setProtoOf : mixinProperties);

/**
 * create a object with helux prototype
 */
export function createHeluxObj(rawObj?: any) {
  const obj = Object.create(null);
  setProto(obj, { ...Object.prototype });
  if (rawObj) {
    Object.assign(obj, rawObj);
  }
  return obj;
}

/**
 * inject helux prototype to raw object
 */
export function injectHeluxProto(rawObj: Dict) {
  if (isFn(rawObj)) {
    return;
  }

  const pureObj = Object.create(null);
  setProto(pureObj, Object.prototype);
  setProto(rawObj, pureObj);
  return rawObj;
}

// default set
function dset(target: any, key: any, val: any) {
  target[key] = val;
  return true;
}

// default get
function dget(target: any, key: any) {
  return target[key];
}

export function createOneLevelOb(rawObj: any, options?: { obj?: any; set?: Fn; get?: Fn }) {
  const { set = dset, get = dget, obj = {} } = options || {};
  Object.keys(rawObj).forEach((key) => {
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: false,
      set: function (val) {
        return set(rawObj, key, val);
      },
      get: function () {
        return get(rawObj, key);
      },
    });
  });
  return obj;
}

/**
 * create observable object
 */
export function createOb(rawObj: any, options?: { set?: Fn; get?: Fn }) {
  const { set = dset, get = dget } = options || {};

  if (canUseProxy()) {
    return new Proxy(rawObj, {
      set(target, key, val) {
        return set(target, key, val);
      },
      get(target, key) {
        return get(target, key);
      },
    });
  }

  const downgradeObj = createHeluxObj();
  const oneLevelOb = createOneLevelOb(downgradeObj, { obj: downgradeObj, set, get });
  return oneLevelOb;
}
