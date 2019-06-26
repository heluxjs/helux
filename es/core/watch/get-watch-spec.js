
export default function (watch, ctx, module) {
  let watchFns;
  const watchType = typeof watch;
  if (watchType === 'function') watchFns = watch(ctx);
  else if (watchType === 'object' && !Array.isArray(watch)) watchFns = watch;
  else throw new Error('watch type can only be a function or a plain json object');

  return { watchFns, module };
}