
// 后续在逐步迁移其他的
export default {
  alwaysGiveState: true,
  // if isStrict is true, every error will be throw out instead of console.error, 
  // but this may crash your app, make sure you have a nice error handling way,
  // like componentDidCatch in react 16.*
  isStrict: false,
  isDebug: false,
  computedCompare: true,
  watchCompare: true,
  watchImmediate: false,
  bindCtxToMethod: false,
}