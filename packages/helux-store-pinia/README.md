# helux-store-pinia

一个优雅的类似 pinia 开发体验的 react 状态管理库，基于 helux 开发

## 安装

```bash
npm i @helux/store-pinia
```

## 简单例子

```ts
const storeCtx = defineStore('Counter', {
  // 定义状态（必须）
  state: () => ({ count: 0 }),
  // 定义带缓存的派生属性（可选）
  getters: {
    countDouble() {
      return this.count * 2;
    },
  },
  // 定义方法修改状态（可选）
  actions: {
    // 同步方法
    addCount(payload: number) {
      this.count = payload;
    },
    // 异步方法
    async addCountAsync(paload: number) {
      await delay();
      this.count = payload;
      // or
      // this.addCount(payload);
    },
  },
});
```

## 复杂例子

创建 store

```ts
const storeCtx = defineStore('BookStore', {
  // 定义状态（必须）
  state: () => ({ list: [] as IBook[], page: 1, size: 10, total: 8, mountCount: 0 }),
  // 定义带缓存的派生属性（可选）
  getters: {
    // 由 state 派生出 totalPlus，上游依赖不变化时此函数不再重复计算
    totalPlus() {
      return this.total + 1;
    },
    // 由其他 getters 派生出 totalPlus2，上游依赖不变化时此函数不再重复计算
    totalPlus2() {
      return this.totalPlus + 100;
    },
  },
  // 定义方法修改状态（可选）
  actions: {
    // 同步方法
    changeTotal(payload: number) {
      this.total = payload;
    },
    // 异步方法
    async fetchList(payload: { page: number; size: number }, p2: number) {
      console.log(payload.page, payload.size);
      await delay();
      const { list, total } = await Promise.resolve({
        list: [
          { id: '1', name: `state_${Date.now()}`, price: 100 },
          { id: '2', name: `helex_${Date.now()}`, price: 100 },
        ],
        total: 10,
      });
      this.list = list;
      this.total = total;
    },
  },
  // 定义生命周期（可选），包含 willMount mounted willUnmount, 含义见 ILifeCycle 定义，
  // lifecycle 方法可访问 actions 里的方法，也可以访问 state 并修改，
  // 但是在 actions 里是访问不到 lifecycle 的，只能由框架负责调用，
  lifecycle: {
    mounted() {
      this.mountCount += 1;
    },
  },
});
```

组件里使用

```jsx
function Shop() {
  const store = storeCtx.useStore();
  const ld = storeCtx.useLoading();
  // fetchList 的运行状态，如关系其他函数运行状态，可从 ld 继续解构获取到
  const { loading, err, ok } = ld.fetchList;

  return (
    <div>
      {loading && <h1>fetching books</h1>}
      {err && <h1>{err.message}</h1>}
      {ok
        && store.list.map((v) => (
          <div key={v.id}>
            name:{v.name} price:{v.price}
          </div>
        ))}
      <h3>total {store.total}</h3>
      <h3>totalPlus {store.totalPlus}</h3>
      <button onClick={() => store.fetchList({ page: 1, size: 10 }, 222)}>more</button>
      <button onClick={() => store.changeTotal(Date.now())}>change total</button>
      <button onClick={() => storeCtx.reset()}>reset</button>
    </div>
  );
}
```

信号感知

```tsx
// 细粒度绑定
function Other() {
  return (
    <div>
      total: {$(storeCtx.state.totalPlus)}
      <br />
      totalPlus2: {$(storeCtx.state.totalPlus2)}
      <br />
      mountCount: {$(storeCtx.state.mountCount)}
    </div>
  );
}
```

打印快照

```tsx
function Snap() {
  storeCtx.useStore();
  return (
    <div style={{ border: '3px solid red', padding: '10px', margin: '12px' }}>
      Snap: {JSON.stringify(storeCtx.getSnap())}
      <br />
      GettersSnap: {JSON.stringify(storeCtx.getGettersSnap())}
      <button
        onClick={() => {
          console.log(storeCtx);
        }}
      >
        see store context
      </button>
    </div>
  );
}
```

添加 redux devtool 插件

```ts
import { HeluxPluginDevtool } from '@helux/plugin-devtool';

import { addPlugin } from '@helux/store-pinia';
addPlugin(HeluxPluginDevtool);
```

下图即添加开发差距后的效果

![Image](https://inews.gtimg.com/newsapp_bt/0/0404172815880_8183/0)

对应代码如下

```ts
import { defineStore } from '@helux/store-pinia';

interface IBook {
  id: string;
  name: string;
  price: number;
}

const delay = (ms = 1000) => new Promise((r) => setTimeout(r, ms));
export const storeCtx = defineStore('DefineStoreDemo', {
  state: () => ({
    list: [] as IBook[],
    page: 1,
    size: 10,
    total: 221,
    mountCount: 0,
    time: 0,
    a: 1,
    b: 2,
    c: 3,
    d: 4,
  }),
  getters: {
    // 由 state 派生出 totalPlus，上游依赖不变化时此函数不再重复计算
    totalPlus() {
      return this.total + 1;
    },
    // 由其他 getters 派生出 totalPlus2，上游依赖不变化时此函数不再重复计算
    totalPlus2() {
      return this.totalPlus + 100;
    },
  },
  actions: {
    // 同步方法
    changeTotal(payload: number) {
      this.total = payload;
    },
    async otherFn(test?: number, test2?: number) {
      await delay(); // ❌ <--- 此处之前无变更，故不会提交
      this.a = Date.now();
      await delay(); // ✅ <--- 在此之前有数据变更，触发提交
      this.b = Date.now();
      await delay(); // ✅<--- 在此之前有数据变更，触发提交
      this.c = Date.now();
      // ✅<--- 结束 action，在此之前有数据变更，触发提交
    },
    // 异步方法
    async fetchList(payload: { page: number; size: number }, p2: number) {
      console.log('START fetchList', payload.page, payload.size);
      await delay(); // ❌ <--- 此处之前无变更，故不会提交
      this.a = Date.now();
      await delay(); // <--- ✅ 在此之前有数据变更，触发提交
      this.b = Date.now();
      await delay(); // <--- ✅ 在此之前有数据变更，触发提交
      this.c = Date.now();
      await delay(); // <--- ✅ 在此之前有数据变更，触发提交
      await this.otherFn(111, 222);
      const { list, total } = await Promise.resolve({
        list: [
          { id: '1', name: `state_${Date.now()}`, price: 100 },
          { id: '2', name: `helex_${Date.now()}`, price: 100 },
        ],
        total: 10,
      });
      this.list = list;
      this.total = total;
      console.log('End fetchList', payload.page, payload.size);
      // ✅<--- 结束 action，在此之前有数据变更，触发提交
    },
  },
});
```

添加自定义插件（ 接收来自 helux 内部的各种事件并做对应处理 ）

```ts
import { addPlugin, IPlugin } from '@helux/store-pinia';

const MyPlugin: IPlugin = {
  install(pluginCtx) {
    pluginCtx.on('ON_SHARE_CREATED', (dataInfo) => {
      // do some staff here
      // console.log('ON_SHARE_CREATED', dataInfo);
    });
    pluginCtx.on('ON_DATA_CHANGED', (dataInfo) => {
      // console.log('ON_DATA_CHANGED', dataInfo);
    });
  },
  name: 'MyPlugin',
};

addPlugin(MyPlugin);
```

添加自定义中间件（中间件在变更提交之前按添加顺序依次执行）

```ts
import { addMiddleware, Middleware } from '@helux/store-pinia';

const myMiddleware: Middleware = (mid) => {
  if (mid.moduleName) {
    // 来自某个模块
    mid.draft.timestamp = new Date(); // 修改一下事件戳
  }
};

addMiddleware(myMiddleware);
```
