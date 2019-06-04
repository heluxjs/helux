import { CCSYNC_KEY, MOCKE_KEY} from '../../support/constant';
import { isEvent } from '../../support/util';


export default (spec, e, stateFor) => {
  let ccint = '', ccsync = '', ccidt = '', value = '', ccdelay = -1, isToggleBool = false;
  const specSyncKey = spec[CCSYNC_KEY];
  const type = spec.type;
  if (specSyncKey !== undefined) {//来自生成的sync生成的setter函数调用
    ccsync = specSyncKey;
    ccdelay = spec.delay;
    ccidt = spec.idt
    if (type === 'val') {//set value

      //优先从spec里取，取不到的话，从e里面分析并提取
      const val = spec.val;
      if (val === undefined) {
        if (isEvent(e)) {
          value = e.currentTarget.value;
        } else {
          value = e;
        }
      } else {
        value = val;
      }
    } else if (type === 'bool') {//toggle bool
      isToggleBool = true;
    } else if (type === 'int') {//convert
      ccint = true;
    } else return null;
  } else {//来自于sync直接调用 <input data-ccsync="foo/f1" onChange={this.sync} /> 
    if (isEvent(e)) {// e is event
      const currentTarget = e.currentTarget;
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

  return { [MOCKE_KEY]:1, currentTarget: { value, dataset: { ccsync, ccint, ccdelay, ccidt } }, stateFor, isToggleBool };
}