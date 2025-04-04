import { cst, Fn, IDataChangedInfo, IPlugin } from 'helux';
import { combineReducers, createStore } from 'redux';

const { EVENT_NAME } = cst;
let reduxStore: any = null;
const pluginName = 'HeluxPluginDevtool';
const moduleInfoMap: Record<string, { name: string; state: any }> = {
  [pluginName]: { name: pluginName, state: 'init helux devtool' }, // 避免调试时再刷新浏览器出现 no store 错误导致 devtool 无法启动
};

function getWindow() {
  // @ts-ignore
  return window || global;
}

function createReducer(module: string, initState = {}) {
  return function (state: any, action: any) {
    if (state === undefined) state = initState;
    if (action.module === module) {
      return action.payload;
    }
    return state;
  };
}

function createReducers() {
  const names = Object.keys(moduleInfoMap);
  const reducers: Record<string, Fn> = {};
  names.forEach(function (name) {
    reducers[name] = createReducer(name, moduleInfoMap[name].state);
  });
  return reducers;
}

let injected = false;

function tryInjectReduxDevTool() {
  if (injected) return;
  const redecers = createReducers();
  if (!Object.keys(redecers).length) return;

  const g = getWindow(); // global this
  reduxStore = createStore(combineReducers(redecers), g.__REDUX_DEVTOOLS_EXTENSION__ && g.__REDUX_DEVTOOLS_EXTENSION__());
  injected = true;

  reduxStore.subscribe(function () {
    if (actionLen === actionPrevLen + 1) {
      actionPrevLen++;
    } else {
      // 来自于devtool点击jump 或者 skip
      console.log(`%c ${pluginName} 暂未实现redux dev tool的jump、skip等功能`, 'color:blue');
    }
  });
}

var actionLen = 1;
var actionPrevLen = 1;
function dispatchAction(actionForRedux: any) {
  if (reduxStore) {
    actionLen++;
    reduxStore.dispatch(actionForRedux);
  }
}

function getPayload(dataInfo: IDataChangedInfo) {
  const { snap, type, moduleName, payloadArgs: args = [] } = dataInfo;
  // redux 要求 payload 必须是对象，这里包装为 { args } 格式，同时放一份到外层方便直接查看
  return { type, payload: { args }, snap, args, module: moduleName };
}

function replaceReducer(moduleName: string, snap: any) {
  moduleInfoMap[moduleName] = { name: moduleName, state: snap };
  tryInjectReduxDevTool();
  reduxStore.replaceReducer(combineReducers(createReducers()));
}

export const HeluxPluginDevtool: IPlugin = {
  install(ctx) {
    tryInjectReduxDevTool();

    ctx.onStateChanged((dataInfo) => {
      const { snap, moduleName } = dataInfo;
      if (!moduleName) return; // 仅接受配置了了模块名的

      const info = moduleInfoMap[moduleName];
      if (!info) {
        return replaceReducer(moduleName, snap);
      }

      dispatchAction(getPayload(dataInfo));
    });

    ctx.on(EVENT_NAME.ON_SHARE_CREATED, (dataInfo) => {
      const { snap, moduleName } = dataInfo;
      if (!moduleName) return; // 仅接受配置了了模块名的

      replaceReducer(moduleName, snap);
    });
  },
  name: pluginName,
};
