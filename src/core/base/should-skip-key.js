

export default function (key, refModule, stateModule, connectSpecLike, moduleStateKeys) {
  let keyModule = '';
  let stateKey = key;

  // !!! 只有带/的key，才会进入此逻辑
  if (key.includes('/')) {// moduledKey : 'foo/f1'
    const [tmpKeyModule, unmoduledKey] = key.split('/');
    stateKey = unmoduledKey;
    // 'foo/f1': keyModule为foo  , /f1'：keyModule为${refModule}
    keyModule = tmpKeyModule || refModule;

    // 状态所属模块和keyModule对不上，直接跳过
    if (keyModule !== stateModule) {
      return { skip: true };
    }
    
    /**
     * defineWatch里定义的观察key和register里定义的观察key，是各自独立的，即
     * foo模块刻意定义watchedKeys为空数组，但是defineWatch里定义了一个key观察函数，该函数依然会被触发
-    */

    if (stateModule === refModule) {
      //这里只是做个保护，其实在调用computed or watch的时候，已对unmoduledKey做了校验
      if (!moduleStateKeys.includes(unmoduledKey)) {
        return { skip: true };
      }
    }else{//提交的状态非refModule，检查connectSpec
      if (!connectSpecLike[stateModule]) {
        return { skip: true };
      }
    }
  }

  return { skip: false, stateKey, keyModule };
}
