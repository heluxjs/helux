---
sidebar_position: 3
---

# 模块名称

`createOptions.moduleName`用于配置模块名称

```ts
atom(someObj, {
  moduleName: 'Price',
});

share(someObj, {
  moduleName: 'UserInfo',
});
```

`helux`内部会对所以共享对象记录一个唯一 id 标记，用户层面给每个共享对象加一个有业务含义的模块名称，后续接入`helux-plugin-devtool`时可查看到各个模块组成的状态树

![state-tree](https://tnfe.gtimg.com/image/akpc29z24n_1699705611085.png)

## 模块名重复

如果配置的模块名重复，对`helux`内部运行并无任何影响，开发模式下`helux`会通过`alert`弹窗提示用户模块名重复，生产模式下重复的模块在传递给`helux-plugin-devtool`时会被丢弃。
