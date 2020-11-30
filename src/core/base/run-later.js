const feature2timerId = {};

export default (cb, feature, delay = 1000) => {
  const timerId = feature2timerId[feature];
  if(timerId)clearTimeout(timerId);
  feature2timerId[feature] = setTimeout(()=>{
    delete feature2timerId[feature];
    cb();
  }, delay);
}
