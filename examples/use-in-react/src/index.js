/*
|--------------------------------------------------------------------------
|
| 应用可能使用了头部 import 静态导入语法来使用hel模块，所以此处
| 将应用入口文件后移一层到 loadApp 里并使用 import() 函数载入，这样以后
| entrance/libProperties 和 loadApp 模块下有其他远程模块依赖且想在整个项目使用静态导入时，
| 可在此文件main 函数里使用 helMicro.preFetchLib 来提前加载别的远程依赖，
|
| @author: fantasticsoul
| @date: 2022-06-05
|--------------------------------------------------------------------------
*/
import { LIB_NAME } from 'configs/subApp';
import { isSubApp, libReady } from 'hel-lib-proxy';
import helMicro from 'hel-micro';
import reportWebVitals from './reportWebVitals';

async function main() {
  // 如有其他包依赖，且需要在逻辑里静态导入，可在此处执行预抓取
  await helMicro.preFetchLib('hel-tpl-remote-lib', {
    custom: {
      host: 'http://localhost:3000',
    },
  });

  const libProperties = await import('./entrance/libProperties');
  // 表示模块已准备就绪，注意此处传递的是 default
  libReady(LIB_NAME, libProperties.default);

  // 非子应用时（即不是被别的模块触发载入的情况），自己挂载渲染节点，方便本地调试
  if (!isSubApp()) {
    await import('./loadApp');
  }
}

main().catch(console.error);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// avoid isolatedModules warning
export default 'Hel Module Index file';
