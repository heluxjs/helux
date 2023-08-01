import { Dict } from '../types';
import { isFn } from '../utils';

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
  let heluxObj = Object.create(null);
  const protoCopy = { ...Object.prototype };
  setProto(heluxObj, protoCopy);
  if (rawObj) {
    Object.assign(heluxObj, rawObj);
  }
  return heluxObj;
}

/**
 * inject helux prototype to raw object
 */
export function injectHeluxProto(rawObj: Dict) {
  if (isFn(rawObj)) {
    return;
  }

  const heluxObj = Object.create(null);
  setProto(heluxObj, Object.prototype);
  setProto(rawObj, heluxObj);
  return rawObj;
}

/**
 * create observable object
 */
export function createOb(rawObj: any, setFn: any, getFn?: any) {
  if (typeof Proxy === 'function') {
    return new Proxy(rawObj, {
      set(target, key, val) {
        return setFn(target, key, val);
      },
      get(target, key) {
        return getFn ? getFn(target, key) : target[key];
      },
    });
  } else {
    const downgradeObj = createHeluxObj();
    Object.keys(rawObj).forEach((key) => {
      Object.defineProperty(downgradeObj, key, {
        enumerable: true,
        configurable: false,
        set: function (val) {
          return setFn(rawObj, key, val);
        },
        get: function () {
          return getFn ? getFn(rawObj, key) : rawObj[key];
        },
      });
    });
    return downgradeObj;
  }
}
