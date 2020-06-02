
// 后续在逐步迁移其他的
export default {
  // if isStrict is true, every error will be throw out instead of console.error, 
  // but this may crash your app, make sure you have a nice error handling way,
  // like componentDidCatch in react 16.*
  isStrict: false,
  isDebug: false,
  computedCompare: true,
  watchCompare: true,
  watchImmediate: false,
  bindCtxToMethod: false,

  extractModuleChangedState: true,
  extractRefChangedState: false,

  // 对于triggerReactSetState调用，当judgeStateChangedForRef为true时，触发__$$ccSetState 前，提取真正发生变化变化的值
  // 对于saveSharedState调用，提取真正发生变化的值作为sharedState，透传给其他实例

  // object类型值的比较规则默认是 false
  // false: 不比较，只要set了就提取出来
  // true: 比较，只有和前一刻的值不一样就提取出来
  objectValueCompare: false,

  // 非object类型值的比较规则默认是 true，
  // false: 不比较，只要set了就提取出来
  // true: 只有和前一刻的值不一样就提取出来
  nonObjectValueCompare: true,
}