var feature_timerId = {};
export default (function (cb, feature, delay) {
  if (delay === void 0) {
    delay = 1000;
  }

  var timerId = feature_timerId[feature];
  if (timerId) clearTimeout(timerId);
  feature_timerId[feature] = setTimeout(function () {
    delete feature_timerId[feature];
    cb();
  }, delay);
});