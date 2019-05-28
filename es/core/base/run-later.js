const feature_timerId = {};

export default (cb, feature, delay = 1000) => {
  const timerId = feature_timerId[feature];
  if(timerId)clearTimeout(timerId);
  feature_timerId[feature] = setTimeout(()=>{
    delete feature_timerId[feature];
    cb();
  }, delay);
}