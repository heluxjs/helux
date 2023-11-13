import { STATE_TYPE } from '../../consts';
import { EVENT_NAME } from '../../consts/user';
import { Dict, Fn, IInnerSetStateOptions, IPlugin, PluginCtx } from '../../types';
import type { TInternal } from '../creator/buildInternal';
import { getRootCtx } from '../root';

const { ON_DATA_CHANGED, ON_SHARE_CREATED } = EVENT_NAME;
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
export function emitDataChanged(internal: TInternal, options: IInnerSetStateOptions, inputDesc?: string) {
  const { bus } = getRootCtx();
  if (bus.canEmit(ON_DATA_CHANGED)) {
    const { from = 'Api' } = options;
    const desc = options.desc || inputDesc || 'setState';
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
  if (bus.canEmit(evName)) {
    const { sharedKey, moduleName } = internal;
    bus.emit(evName, { moduleName, sharedKey, data });
  }
}
