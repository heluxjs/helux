import { CCSYNC_KEY, MOCKE_KEY } from '../../support/constant';
import { convertToStandardEvent } from '../../support/util';
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

export default (spec, e, refModule) => {
  let ccint = false, ccsync = '', ccrkey = '', value = '', extraState = undefined, ccdelay = -1, isToggleBool = false;
  const syncKey = spec[CCSYNC_KEY];
  const type = spec.type;
  
  if (syncKey !== undefined) {//来自生成的sync生成的setter函数调用
    ccsync = syncKey;
    ccdelay = spec.delay;
    ccrkey = spec.rkey
    if (type === 'val' || type === 'int') {//set value
      ccint = type === 'int';//convert to int

      //优先从spec里取，取不到的话，从e里面分析并提取
      const val = spec.val;
      if (val === undefined) {
        value = getValFromEvent(e);
      } else {
        if (typeof val === 'function') {
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

          extraState = val(getValFromEvent(e), keyPath, { moduleState: getState(module), fullKeyPath });
        } else {
          value = val;
        }
      }
    } else if (type === 'bool') {//toggle bool
      isToggleBool = true;
    } else return null;
  } else {//来自于sync直接调用 <input data-ccsync="foo/f1" onChange={this.sync} /> 
    const se =convertToStandardEvent(e);
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

  return { [MOCKE_KEY]: 1, currentTarget: { value, extraState, dataset: { ccsync, ccint, ccdelay, ccrkey } }, isToggleBool };
}