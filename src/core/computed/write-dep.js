export default function (retKey, depKeys) {
  return new Proxy(state, {
    get: function (target, key) {
      if (!depKeys.includes(key)) depKeys.push(key);
      return target[key];
    },
    set: function (target, key) {
      target[key] = target[key];
      return true;
    }
  });
}