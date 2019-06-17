
export default function (watch, ctx) {
  let watchSpec;
  const watchType = typeof watch;
  if (watchType === 'function') watchSpec = watch(ctx);
  else if (watchType === 'object' && !Array.isArray(watch)) watchSpec = watch;
  else throw new Error('watch type can only be a function or a plain json object');

  return watchSpec;
}