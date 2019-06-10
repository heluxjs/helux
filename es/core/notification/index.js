import * as util from '../../support/util';

const type_cbs_ = {};

export function send(type, payload) {
  const cbs = util.safeGetArrayFromObject(type_cbs_, type);
  cbs.forEach(cb => {
    cb(payload);
  });
}

export function subscribe(type, cb) {
  const cbs = util.safeGetArrayFromObject(type_cbs_, type);
  cbs.push(cb);
}