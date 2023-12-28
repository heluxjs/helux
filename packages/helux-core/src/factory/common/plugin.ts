import { STATE_TYPE } from '../../consts';
import { EVENT_NAME } from '../../consts/user';
import { Dict, Fn, IMutateCtx, IPlugin, PluginCtx } from '../../types/base';
import type { TInternal } from '../creator/buildInternal';
import { getRootCtx } from '../root';

const { ON_DATA_CHANGED, ON_SHARE_CREATED, ON_ERROR_OCCURED } = EVENT_NAME;
const loadingTypes: string[] = [STATE_TYPE.GLOGAL_LOADING, STATE_TYPE.PRIVATE_LOADING];

export function addPlugin(plugin: IPlugin) {
  const { plugins, bus } = getRootCtx();
  plugins.push(plugin);
  const pluginCtx: PluginCtx = {
    on: (evName: string, cb: Fn) => bus.on(evName, cb),
    onStateChanged: (cb: Fn) => bus.on(ON_DATA_CHANGED, cb),
  };
  plugin.install(pluginCtx);
}

/**
 * 发射数据已变更事件到已安装插件
 */
export function emitDataChanged(internal: TInternal, mutateCtx: IMutateCtx) {
  const { bus } = getRootCtx();
  if (bus.canEmit(ON_DATA_CHANGED)) {
    const { from, desc } = mutateCtx;
    const { sharedKey, moduleName, snap, usefulName, stateType } = internal;
    let type;
    if (loadingTypes.includes(stateType)) {
      // 来自伴生的 loading 状态调用
      type = `${usefulName}/setState`;
    } else {
      type = `${usefulName}@${from || 'Api'}/${desc}`;
    }
    bus.emit(ON_DATA_CHANGED, { snap, sharedKey, moduleName, type });
  }
}

/**
 * 让 helux-plugin-redux-devtool 插件更早的创建 reducers
 */
export function emitShareCreated(internal: TInternal) {
  const { bus } = getRootCtx();
  if (bus.canEmit(ON_SHARE_CREATED)) {
    const { snap, sharedKey, moduleName, usefulName } = internal;
    const type = `${usefulName}@FactoryApi/createShared`;
    bus.emit(ON_SHARE_CREATED, { snap, sharedKey, moduleName, type });
  }
}

export function emitPluginEvent(internal: TInternal, evName: string, data: Dict) {
  const { bus } = getRootCtx();
  if (!bus.canEmit(evName)) {
    return false;
  }
  const { sharedKey, moduleName } = internal;
  bus.emit(evName, { moduleName, sharedKey, data });
  return true;
}

export function emitErr(internal: TInternal, err: Error) {
  // 未安装错误捕捉插件时，提示作者出现错误的位置
  if (!emitPluginEvent(internal, ON_ERROR_OCCURED, { err })) {
    console.warn('found uncaught error, sugguest add a plugin to handle this error');
    console.error(err);
  }
}
