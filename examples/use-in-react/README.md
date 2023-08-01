## remote-react-comps-tpl

最简单的远程 react 组件模板 codesandbox: https://codesandbox.io/s/demo-load-remote-react-comp-2bnpl0?file=/src/App.js

### 发布 npm

发布远程组件到 npm

```bash
npm run build
npm publish
```

### 本地联调

辅助模块使用方的 custom 配置，基于当前模块的已构建产物进行联调

```bash
npm run build_cust
cd hel_dist
# 如未安装 http-server，执行 npm i http-server -g 即可
# 指导端口可执行 http-server --cors -p 8081
http-server --cors
```

### chunk 设置

经过测试对比验证，对应带样式文件的组件项目，设置为 4 是最佳的，刚好拆分为 runtime-main.js main.js chunk.js chunk.css 且 chunk.css 可以直接注入到 index.html 里供 hel-micro 控制是否需要加载

// 同时也避免报错： // chunk runtime-main [entry] // Cannot convert undefined or null to object

```js
new webpack.optimize.LimitChunkCountPlugin({
  // 必须大于或等于 1，
  maxChunks: 4,
}),
```

### shouldInlineRuntimeChunk

设置为 false，不产生产物 map 文件

### 单文件 css

控制 `splitChunks.cacheGroups.css` 为

```ts
const cacheGroupsCss = {
  name: 'css',
  test: /\.css$/,
  minChunks: 1,
  enforce: true,
};
```

有利于做 hel-micro 上层适配库做 shadow 处理见：https://juejin.cn/post/6992887038093557796

### css 插入规则

当 `src/index.ts` 导入函数全部写为 `import()`函数方式时，构建生成的 index.html 里不包含有 css 文件 link， css 文件 link 是由 runtime.main.js 动态拼接到 header 里的，这不是我们期望的结果，因为我们想让上层适配库（例如`hel-micro-react`）有机会可控制 css 加载时机，从而方便做 shaw-dom 隔离

而写为头部静态导入时，就包含了 css 文件 link 了。

### cjs 包

以下 package.json 里的 script 命令暂时移出，这里涉及到如何使用 webpack 打包组件库的知识点，欢迎同事贡献

> 待后续 hel-micro 支持非浏览器环境能解析远程模块就不需要了，无该命名不影响远程模块的提供和使用，仅影响使用方执行测试是，jest 需要自己打桩，如果提供了直接使用`hel_bundle/xxx.js`文件作文打桩对象会方便一些

```bash
    "build_bundle": "tsc & cross-env BUNDLE=true node ./scripts/replaceToRelativePath.js & cross-env BUNDLE=true node scripts/build.js",
    "build_npm": "npm run build_proxy && npm run build_bundle",
```
