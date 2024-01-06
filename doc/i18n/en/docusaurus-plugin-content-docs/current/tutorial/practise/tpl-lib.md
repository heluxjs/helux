---
sidebar_position: 1
---

# 制作 lib 模板项目

本教程引导用户如何使用`react-react-app`创建一个开发远程 lib 库的模板项目，学完整个制作过程，你可以自己定制一个专属你的远程 lib 库的模板项目了，当然了，你也可基于我们已做好的[ts 模板项目](https://github.com/hel-eco/hel-tpl-remote-lib)做二次修改。

## 初始化项目骨架

```bash
npx create-react-app tpl-my-lib --template=typescript
```

## 获取项目配置目录

执行以下命令，获得获取项目的`config`配置目录，方便后续我们做进一步的修改

```bash
npm run eject
```

### 调整依赖目录

因我们只是想用这个项目制作远程 lib 库，默认带的一些 react 相关运行时依赖我们可以删除掉
