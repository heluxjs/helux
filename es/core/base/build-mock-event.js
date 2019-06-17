import { CCSYNC_KEY, MOCKE_KEY } from '../../support/constant';
import { convertToStandardEvent } from '../../support/util';

export default (spec, e, stateFor) => {
  let ccint = false, ccsync = '', ccidt = '', value = '', ccdelay = -1, isToggleBool = false;
  const specSyncKey = spec[CCSYNC_KEY];
  const type = spec.type;
  if (specSyncKey !== undefined) {//来自生成的sync生成的setter函数调用
    ccsync = specSyncKey;
    ccdelay = spec.delay;
    ccidt = spec.idt
    if (type === 'val' || type === 'int') {//set value
      ccint = type === 'int';//convert to int

      //优先从spec里取，取不到的话，从e里面分析并提取
      const val = spec.val;
      if (val === undefined) {
        const se =convertToStandardEvent(e);
        if (se) {
          value = se.currentTarget.value;
        } else {
          value = e;
        }
      } else {
        value = val;
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
      else ccint = dataset.ccint != undefined;

      ccsync = dataset.ccsync;
      if (!ccsync) return null;

      ccidt = dataset.ccidt;

      const dataSetDelay = dataset.ccdelay;
      if (dataSetDelay) {
        try { ccdelay = parseInt(dataSetDelay); } catch (err) { }
      }

    } else {
      //<Input onChange={this.sync}/> is invalid
      return null;
    }
  }

  return { [MOCKE_KEY]: 1, currentTarget: { value, dataset: { ccsync, ccint, ccdelay, ccidt } }, stateFor, isToggleBool };
}