/** watch section */
const _watchDep = {};
const _watchRaw = {};
const watch = {
  _watchRaw,
  _watchDep,
  getRootWatchDep: () => _watchDep,
  getRootWatchRaw: () => _watchRaw,
};

export default watch;