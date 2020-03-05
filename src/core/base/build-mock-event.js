import { CCSYNC_KEY } from '../../support/constant';
import { convertToStandardEvent, justWarning, getValueByKeyPath } from '../../support/util';
import ccContext from '../../cc-context';

const { store: { getState } } = ccContext;

function getValFromEvent(e) {
  const se = convertToStandardEvent(e);
  if (se) {
    return se.currentTarget.value;
  } else {
    return e;
  }
}

export default (spec, e, refCtx) => {
  const { module: refModule, state: refState } = refCtx;
  let ccint = false, ccsync = '', ccrkey = '', value = '', extraState = null, ccdelay = -1, isToggleBool = false;
  const syncKey = spec[CCSYNC_KEY];
  const type = spec.type;
  let noAutoExtract = false;

  if (syncKey !== undefined) {//来自sync生成的setter函数调用 即 sync('xxxKey')
    ccsync = syncKey;
    ccdelay = spec.delay;
    ccrkey = spec.rkey;

    // type 'bool', 'val', 'int', 'as'
    ccint = type === 'int';//convert to int
    isToggleBool = type === 'bool';

    let keyPath, fullKeyPath, module;
    if (ccsync.includes('/')) {
      const [_module, _keyPath] = ccsync.split('/');
      keyPath = _keyPath;
      fullKeyPath = ccsync;
      module = _module;
    } else {
      keyPath = ccsync;
      fullKeyPath = `${refModule}/${keyPath}`;
      module = refModule;
    }

    const mState = getState(module);
    // 布尔值需要对原来的值取反
    const fullState = module !== refModule ? mState : refState;
    value = type === 'bool' ? !getValueByKeyPath(fullState, keyPath) : getValFromEvent(e);

    //优先从spec里取，取不到的话，从e里面分析并提取
    const val = spec.val;
    if (val === undefined) {
      // do nothing
    } else {
      if (typeof val === 'function') {
        // moduleState指的是所修改的目标模块的state
        const syncRet = val(value, keyPath, { module, moduleState: mState, fullKeyPath, state: refState, refCtx });

        if (syncRet != undefined) {
          if (type === 'as') value = syncRet;// value is what cb returns;
          else {
            const retType = typeof syncRet;
            if (retType === 'boolean') {
              // if return true, let noAutoExtract = false, so this cb will not block state update, and cc will extract partial state automatically
              // if return false, let noAutoExtract = true, but now extraState is still null, so this cb will block state update
              noAutoExtract = !syncRet;
            } else if (retType === 'object') {
              noAutoExtract = true;
              extraState = syncRet;
            } else {
              justWarning(`syncKey[${syncKey}] cb result type error.`);
            }
          }
        }else{
          if (type === 'as') noAutoExtract = true;// if syncAs return undefined, will block update
          // else continue update and value is just extracted above
        }

      } else {
        value = val;
      }
    }
  } else {//来自于sync直接调用 <input data-ccsync="foo/f1" onChange={this.sync} /> 
    const se = convertToStandardEvent(e);
    if (se) {// e is event
      const currentTarget = se.currentTarget;
      value = currentTarget.value;
      const dataset = currentTarget.dataset;

      if (type === 'int') ccint = true;
      else ccint = dataset.ccint !== undefined;

      ccsync = dataset.ccsync;
      if (!ccsync) return null;

      ccrkey = dataset.ccrkey;

      const dataSetDelay = dataset.ccdelay;
      if (dataSetDelay) {
        try { ccdelay = parseInt(dataSetDelay); } catch (err) { }
      }

    } else {
      //<Input onChange={this.sync}/> is invalid
      return null;
    }
  }

  return { currentTarget: { value, extraState, noAutoExtract, dataset: { ccsync, ccint, ccdelay, ccrkey } }, isToggleBool };
}