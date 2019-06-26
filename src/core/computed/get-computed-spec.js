
export default function (computed, ctx, module) {
  let computedFns;
  const computedType = typeof computed;;
  if (computedType === 'function') computedFns = computed(ctx);
  else if (computedType === 'object' && !Array.isArray(computed)) computedFns = computed;
  else throw new Error('computed type can only be a function or a plain json object');

  return { computedFns, module };
}