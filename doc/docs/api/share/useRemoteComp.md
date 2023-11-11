---
sidebar_position: 2
---

# useRemoteComp

通过 `useRemoteComp` 获取指定名字的远程模块暴露的组件

```ts
function useRemoteComp<T extends any = React.ForwardRefExoticComponent<any>>(
  name: string,
  compName: string,
  options?: IUseRemoteCompOptions,
): T;
```

## 基本用法

获取远程组件，如果当前用户未在灰度名单里，则返回最新版本模块暴露的组件，反之则返回灰度版本模块暴露的组件

```jsx
const Comp = useRemoteComp('remote-tdesign-react', 'Button');
return <Comp ref={someRef} label="any props you want" />;
```

## 指定版本号

```js
useRemoteComp('remote-tdesign-react', 'Button', {
  versionId: 'remote-tdesign-react_20220611094219',
});
```

## IUseRemoteCompOptions

| <div style={{width:'150px'}}>属性</div> | <div style={{width:'150px'}}>类型</div> | <div style={{width:'200px'}}>默认值</div> | <div style={{width:'355px'}}>描述</div> |
| --- | --- | --- | --- |
| shadow | boolean | true | 是否使用采样 shaw-dom 模式渲染 |
| appendCss | boolean | 未显式设置 appendCss 时，它的默认受设置 shadow 影响<br/> false [when shadow true] <br/>true [when shadow false] | 是否向 document 或 shadow-root 上附加样式外联样式标签 |
| getStyleStr | (styleStr: string) => string | undefined | 替换或改造默认解析出来的字符串 |

文档正在拼命建设中，有疑问可联系 [fantasticsoul](https://github.com/fantasticsoul) 或提 [issue](https://github.com/tnfe/hel/issues)，关注我的[掘金主页](https://juejin.cn/user/1732486056649880/posts)了解更多 ....\*\* ....
