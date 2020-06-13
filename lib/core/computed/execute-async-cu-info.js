"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = executeCuInfo;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _util = require("../../support/util");

var cst = _interopRequireWildcard(require("../../support/constant"));

var waKeyMap = _interopRequireWildcard(require("../../cc-context/wakey-ukey-map"));

var _refs = _interopRequireDefault(require("../../cc-context/refs"));

var _catchCcError = _interopRequireDefault(require("../base/catch-cc-error"));

var _index = require("../plugin/index");

/* eslint-disable */
var waKey_uKeyMap_ = waKeyMap.waKey_uKeyMap_,
    waKey_staticUKeyMap_ = waKeyMap.waKey_staticUKeyMap_;

function triggerReRender(ref) {
  if (!ref) return; // 对于挂载好了还未卸载的实例，才有必要触发重渲染

  if (ref.__$$isUnmounted === false) {
    var refCtx = ref.ctx;

    refCtx.__$$ccForceUpdate();
  }
}

function executeCuInfo(_x) {
  return _executeCuInfo.apply(this, arguments);
}

function _executeCuInfo() {
  _executeCuInfo = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(cuInfo) {
    var sourceType, ref, module, fnAsync, fns, fnRetKeys, cuRetContainer, retKey_stateKeys_, len, isModule, stateKeys, curRetKey, i, fn, isAsync, retKey, ret, toSend, uKeyMap, uKeys;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return (0, _util.delay)();

          case 3:
            sourceType = cuInfo.sourceType, ref = cuInfo.ref, module = cuInfo.module, fnAsync = cuInfo.fnAsync, fns = cuInfo.fns, fnRetKeys = cuInfo.fnRetKeys, cuRetContainer = cuInfo.cuRetContainer, retKey_stateKeys_ = cuInfo.retKey_stateKeys_;
            len = fns.length;
            isModule = sourceType !== cst.CATE_REF;
            stateKeys = [];
            curRetKey = '';
            _context.prev = 8;
            (0, _index.send)(cst.SIG_ASYNC_COMPUTED_BATCH_START, {
              module: module
            });
            i = 0;

          case 11:
            if (!(i < len)) {
              _context.next = 31;
              break;
            }

            fn = fns[i];
            isAsync = fnAsync[i];
            retKey = fnRetKeys[i];
            curRetKey = retKey;
            ret = void 0;
            (0, _index.send)(cst.SIG_ASYNC_COMPUTED_START, {
              module: module,
              retKey: retKey
            });

            if (!isAsync) {
              _context.next = 24;
              break;
            }

            _context.next = 21;
            return fn();

          case 21:
            ret = _context.sent;
            _context.next = 25;
            break;

          case 24:
            ret = fn();

          case 25:
            cuRetContainer[retKey] = (0, _util.makeCuPackedValue)(false, ret);
            (0, _index.send)(cst.SIG_ASYNC_COMPUTED_END, {
              module: module,
              retKey: retKey
            });
            if (isModule) stateKeys = stateKeys.concat(retKey_stateKeys_[retKey]);

          case 28:
            i++;
            _context.next = 11;
            break;

          case 31:
            (0, _index.send)(cst.SIG_ASYNC_COMPUTED_BATCH_END, {
              module: module
            });
            _context.next = 38;
            break;

          case 34:
            _context.prev = 34;
            _context.t0 = _context["catch"](8);

            if (isModule) {
              toSend = {
                module: module,
                err: _context.t0,
                retKey: curRetKey
              };
              (0, _index.send)(cst.SIG_ASYNC_COMPUTED_ERR, toSend);
              (0, _index.send)(cst.SIG_ASYNC_COMPUTED_BATCH_END, toSend);
            }

            (0, _catchCcError["default"])(_context.t0);

          case 38:
            if (isModule) {
              //  让所有正确执行完毕的计算函数关联到的实例能够被触发重渲染
              stateKeys = Array.from(new Set(stateKeys));
              uKeyMap = {};
              stateKeys.forEach(function (stateKey) {
                var waKey = module + "/" + stateKey; // 利用assign不停的去重

                Object.assign(uKeyMap, waKey_uKeyMap_[waKey], waKey_staticUKeyMap_[waKey]);
              });
              uKeys = (0, _util.okeys)(uKeyMap);
              uKeys.forEach(function (refKey) {
                triggerReRender(_refs["default"][refKey]);
              });
            } else {
              triggerReRender(ref);
            }

            _context.next = 44;
            break;

          case 41:
            _context.prev = 41;
            _context.t1 = _context["catch"](0);
            (0, _catchCcError["default"])(_context.t1);

          case 44:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 41], [8, 34]]);
  }));
  return _executeCuInfo.apply(this, arguments);
}