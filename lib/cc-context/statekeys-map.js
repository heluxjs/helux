"use strict";

exports.__esModule = true;
exports["default"] = void 0;

/**
 * 为避免cc-context文件里调用的方法和自身产生循环引用，将moduleName_stateKeys_单独拆开放置到此文件
 * 如果还有别的类似循环引用产生，都可以像moduleName_stateKeys_一样单独拆出来放置为一个文件
 */
var moduleName_stateKeys_ = {
  '$$default': []
}; // 映射好模块的状态所有key并缓存住，用于提高性能

var _default = moduleName_stateKeys_;
exports["default"] = _default;