---
sidebar_position: 2
---

# 模块开发-js 库

目标：

- 学会基于模块模板项目快发开发一个新的 hel 模块

可以被别的项目动态引用，也可应用其他动态模块作为自己的依赖

## 开发远程库

### 克隆模板库

克隆远程库模板为`my-xx-lib`（名字请按实际需要修改，此处仅做示例）

```bash
npx degit https://github.com/hel-eco/hel-tpl-remote-lib my-xx-lib
```

:::tip npm degit

npm degit 命令是为了检出一份不包含任何 git 信息的目录，等同于 git clone xxx_url && cd xxx_url && rm- rf ./.gitinfo

:::

### 改 package.json

将`name`和`appGroupName`改为自己想要设定的 hel 模块组名

```
  "name": "my-xx-lib",
  "appGroupName": "my-xx-lib",
```

### 改 subApp

`src/configs/subApp.ts`改为你 hel 模块组名，以便让构建元数据时能够校验通过

```ts
export const LIB_NAME = 'my-xx-lib';
```

### 开发业务代码

在`utils`目录下新增任意模块，或导入已有的第三方 npm 模块（即是将 npm 模块提升为 hel 动态模块），并在`utils/index.ts`里导出即可

### 执行单测

已内置`jest`，执行`npm run test`即可

### 发布组件

先修改`package.json`里的`version`值

然后发布源码和托管到`unpkg`文件服务的运行代码

```
npm run build
npm publish
```

或发布可供桩函数 mock 的运行代码、源码和托管到`unpkg`文件服务的运行代码

```
npm run build_stub
npm publish
```

:::tip

`build_stub`是可选的执行项，仅是为了方便模块使用方的项目执行单测时，`jest`可通过 npm 的 cjs 模块来做函数打桩，`npm run build` 和 `npm run build_stub` 二者执行其中一个即可

```ts
import entry from 'my-xx-lib/hel_bundle/entry';

jest.doMock('my-xx-lib', () => {
  return entry['my-xx-lib'];
});
```

:::

有关`如何发布到自定义的托管文件服务`，可跳转到[模块发布](/docs/tutorial/helmod-pub)查阅以便了解更多详情

其余文档正在拼命建设中，有疑问可联系 [fantasticsoul](https://github.com/fantasticsoul) 或提 [issue](https://github.com/tnfe/hel/issues) ....
