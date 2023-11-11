---
sidebar_position: 5
---

# appReady

`appReady`是服务于模块提供方的接口，用于运行时将当前模块的需暴露的应用根组件（react 项目、vue 项目等）提供给其他项目（即远程模块的使用方）

## 基本用法

### 暴露模块对象

仅指定模块组名暴露对象

```ts
async function main() {
  const { appReady } = await import('hel-lib-proxy');
  const { LIB_NAME } = await import('./configs/subApp');

  const App = await import('./App'); // 项目根组件
  appReady(LIB_NAME, App);
}

main().catch(console.error);
```

### 指定平台值

暴露的模块默认属于`unpkg`平台，当用户有自定义平台时，可指定具体的平台值暴露模块

```ts
appReady('xxx', App, { platform: 'myplat' });
```

之后模块使用方使用[preFetchApp](/docs/api/hel-micro/prefetch-app)接口加载该项目根组件时，就需要指定相同的平台值才能正常拉取到

```ts
preFetchApp('xxx', { platform: 'myplat' });
```

### 指定版本号

通常情况下 sdk 会从加载当前模块的链接里推导出模块对应的版本号

```bash
# 以下链接会推导出版本号 1.1.3
https://unpkg.com/hel-tpl-remote-vue-comps@1.1.3/hel_dist/hel-meta.json
```

当用户做一些私有化部署或有自己的版本号定义规则时，可指定版本号后暴露模块

```ts
appReady('xxx', App, { versionId: 'v1-prerelase' });
// 发布后使用方之后可指定对应版本号加载
preFetchApp('xxx', { versionId: 'v1-prerelase' });
```

### 指定应用名

初始状态下，[应用名与应用组名](docs/api/basic/glossary#应用名与应用组名)是一致的，在存在对同一套代码除了按版本这个维度之外的更多加载场景的诉求时，可指定应用名暴露根组件

```ts
appReady('xxx', App, { appName: 'xxx-dev' });
```
