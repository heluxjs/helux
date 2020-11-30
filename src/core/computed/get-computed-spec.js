
export default function (computedFns, module) {
  const hasFn = Object.keys(computedFns).length > 0;
  return { computedFns, module, hasFn };
}
