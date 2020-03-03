import { CCSYNC_KEY, MOCKE_KEY } from '../../support/constant';
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
  let hasSyncCb = false;

  if (syncKey !== undefined) {//来自sync生成的setter函数调用 即 sync('xxxKey')
    ccsync = syncKey;
    ccdelay = spec.delay;
    ccrkey = spec.rkey;
    if (['bool', 'val', 'int'].includes(type)) {
      ccint = type === 'int';//convert to int
      isToggleBool = type === 'bool';

      //优先从spec里取，取不到的话，从e里面分析并提取
      value = type === 'bool' ? !getValueByKeyPath(refState, ccsync) : getValFromEvent(e);
      
      const val = spec.val;
      if (val === undefined) {
        // do nothing
      } else {
        if (typeof val === 'function') {
          // 布尔值需要对原来的值取反

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

          const syncRet = val(value, keyPath, { moduleState: getState(module), fullKeyPath, state: refState, refCtx });
          if (syncRet != undefined) {
            const retType = typeof syncRet;
            if (retType === 'boolean') {
              // if return true, let hasSyncCb = false, so this cb will not block state update, and cc will extract partial state automatically
              // if return false, let hasSyncCb = true, but now extraState is still null, so this cb will block state update
              hasSyncCb = !retType;
            }else if(retType === 'object'){
              hasSyncCb = true;
              extraState = syncRet;
            }else{
              justWarning(`syncKey[${syncKey}] cb result type error.`);
            }
          }

        } else {
          value = val;
        }
      }
    }else return null;
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

  return { [MOCKE_KEY]: 1, currentTarget: { value, extraState, hasSyncCb, dataset: { ccsync, ccint, ccdelay, ccrkey } }, isToggleBool };
}