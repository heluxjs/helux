---
sidebar_position: 4
---

# 模块开发-vue 组件

目标：

- 学会基于远程 vue 组件模板项目快发开发一个新的 vue 组件，供 `hel-micro` 或 `hel-micro-vue` 消费。

- 学会将现有 vue 项目改造可供 `hel-micro` 或 `hel-micro-vue` 消费的模块

> codesandbox 使用示例：https://codesandbox.io/s/demo-load-remote-vue-comp-st0295

:::caution

hel-micro-vue 还在开发中，它的作用是提供 shaw-dom 做样式隔离，并以 vue 异步微组件的形式懒加载目标远程组件，加载过程中会有骨架屏过度

:::

## 开发远程 vue 组件

### 克隆模板库

克隆远程 vue 组件模板项目为`rvc-xxx`（名字请按实际需要修改，此处仅做示例）

```bash
https://github.com/hel-eco/hel-tpl-remote-vue-comp
```

### 改 package.json

将`name`和`appGroupName`改为 hel 模块组名

```
  "name": " rvc-xxx",
  "appGroupName": " rvc-xxx",
```

### 改 subApp

`src/configs/subApp.ts`改为你 hel 模块组名，以便让构建元数据时能够校验通过

```ts
export const LIB_NAME = 'rvc-xxx';
```

### 开发组件

在`src/components`目录下新增组件，并`src/components/index`文件里导出即可

## 发布组件

跳转到[模块发布](/docs/tutorial/helmod-pub)查看

其余文档正在拼命建设中，有疑问可联系 [fantasticsoul](https://github.com/fantasticsoul) 或提 [issue](https://github.com/tnfe/hel/issues) ....
