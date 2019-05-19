#### 2019-05-19
* 去掉cc实例内置的 `$$commit`,`$$call`等系列相关的无用函数
* 重构configure函数，让其使用体验和run|load保持一致
* 为cc实例提供新属性`$$connectedComputed`
* 为cc实例提供新方法`$$attach`，只是在存在多重装饰器时，如果不想在类里面通过this.props.***来调用cc注入的方法时，可以在类的`componentWillMount`里调用`this.props.$$attach(this)`
* 为`CcFragment`的render函数参数列表提供新参数: `connectedComputed、on、onIdentity、emitIdentity`