# helux-hooks-impl

## useObject

使用普通对象，需注意此接口只接受普通对象，应用里使用 useObject 替代 React.useState 将享受到以下两个好处

- 方便定义多个状态值时，少写很多 useState
- 内部做了 unmount 判断，让异步函数也可以安全的调用 setState，避免 react 出现警告 : "Called SetState() on an Unmounted Component" Errors

```ts
const [obj, setObj] = useObject({ num: 1, age: 2 });
setObj({ num: 2 }); // 只需要传修改的值即可，内部会自动合并
```

## useMutable

深层次的修改需要使用 `useMutable` 替代 `useObject`

```ts
const [state, setState] = useMutable({ info: { age: 1 } });
setState((draft) => (draft.info.age = 2));
```

## useEffect

对齐 React.useEffect，但优化了调用逻辑，即 strict 模式与普通模式行为一致，只有一次 mount 与 unmount 产生

```ts
import { useEffect } from 'helux';

function Comp() {
  useEffect(() => {
    log('helux.useEffect', 'print one time at strict mode');
    return () => log('helux.useEffect', 'cleanup');
  }, []);
  React.useEffect(() => {
    logRed('React.useEffect', 'print 2 times at strict mode');
    return () => logRed('React.useEffect', 'cleanup');
  }, []);
  return <MarkUpdate>test useEffect</MarkUpdate>;
}
```

## useStable

生成稳定的对象，对象的所有方法将转为稳定引用，且回调里始终可以读到外部的最新值，无闭包陷阱

```ts
function Comp(props: any) {
  const [obj, setObj] = useObject({ num: 1 });
  // srv 是稳定的，srv.readState，srv.readProps，srv.changeState 是稳定的
  const srv = useStable({
    readState() {
      console.log(`%c read state num ${obj.num}`, `color:green`);
    },
    readProps() {
      console.log(`%c read props num ${props.num}`, `color:green`);
    },
    changeState() {
      setObj({ num: random() });
    },
  });

  // 传入值，则只是返回最新值
  const numTwo = useStable(2);

  // 如传入单函数，则返回的稳定的函数引用
  const fn = useStable(() => {
    console.log(`%c read state num ${obj.num}`, `color:green`);
  });
}
```
