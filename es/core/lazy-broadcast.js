export function LazyBroadcast(module, lazyMs) {
  this.module = module;
  this.lazyMs = lazyMs;
}
export default (function (module, lazyMs) {
  return new LazyBroadcast(module, lazyMs);
});