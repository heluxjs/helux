
export default function (computedFns, module) {
  let hasFn = Object.keys(computedFns).length > 0;
  return { computedFns, module, hasFn };
}
