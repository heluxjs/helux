

## computed
利用类型索引获取子类型
```js
function computed<T>(stateKey:string, cb:(newVal:T, oldVal:T, fnCtx:any)=>any):void { 

}

interface BookState {
    name: string, 
    age: number,
}

computed<BookState['name']>('name', (oname, nname) => { 

})
```
