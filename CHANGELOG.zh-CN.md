
# Change Log

## 2018-12-04 14:00
* 引入co，在CC实例上新增$invoke , $invokeWith方法，可以调用用户的逻辑函数，不限定函数类型，可以是async、generator或者普通函数任意一种

## 2018-12-04 09:00
* 删除CC实例上原来的call，callWith函数，更新为$$call, $$callWith函数
* 新增$callThunk, $callThunkWith, 方便调用thunk函数
* 新增单例模式，单例模式CCClass只能实例化一次，ccUniqueKey就是CCClassName, refs可以直接通过CCClassName调用reactRef的方法

## 2018-12-03
* 新增 ccIns.call, ccIns.callWith函数，方便更灵活的改变state
* 修复在webpack 热加载模式下，CC_CONTEXT.refs 维护不正确的问题