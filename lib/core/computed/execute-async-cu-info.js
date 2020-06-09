"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = executeCuInfo;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _util = require("../../support/util");

var waKeyMap = _interopRequireWildcard(require("../../cc-context/wakey-ukey-map"));

var _refs = _interopRequireDefault(require("../../cc-context/refs"));

var _constant = require("../../support/constant");

var _catchCcError = _interopRequireDefault(require("../base/catch-cc-error"));

/* eslint-disable */
var waKey_uKeyMap_ = waKeyMap.waKey_uKeyMap_,
    waKey_staticUKeyMap_ = waKeyMap.waKey_staticUKeyMap_;

function triggerReRender(ref) {
  // 对于挂载好了还未卸载的实例，才有必要触发重渲染
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
    var sourceType, ref, module, fnAsync, fns, fnRetKeys, cuRetContainer, retKey_stateKeys_, len, stateKeys, i, fn, isAsync, retKey, ret, uKeyMap, uKeys;
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
            stateKeys = [];
            i = 0;

          case 7:
            if (!(i < len)) {
              _context.next = 24;
              break;
            }

            fn = fns[i];
            isAsync = fnAsync[i];
            retKey = fnRetKeys[i];
            ret = void 0;

            if (!isAsync) {
              _context.next = 18;
              break;
            }

            _context.next = 15;
            return fn();

          case 15:
            ret = _context.sent;
            _context.next = 19;
            break;

          case 18:
            ret = fn();

          case 19:
            cuRetContainer[retKey] = (0, _util.makeCuPackedValue)(false, ret);
            if (sourceType !== _constant.CATE_REF) stateKeys = stateKeys.concat(retKey_stateKeys_[retKey]);

          case 21:
            i++;
            _context.next = 7;
            break;

          case 24:
            if (sourceType !== _constant.CATE_REF) {
              stateKeys = Array.from(new Set(stateKeys));
              uKeyMap = {};
              stateKeys.forEach(function (stateKey) {
                var waKey = module + "/" + stateKey; // 利用assign不停的去重

                Object.assign(uKeyMap, waKey_uKeyMap_[waKey], waKey_staticUKeyMap_[waKey]);
              });
              uKeys = (0, _util.okeys)(uKeyMap);
              uKeys.forEach(function (refKey) {
                var ref = _refs["default"][refKey];
                if (!ref) return;
                triggerReRender(ref);
              });
            } else {
              triggerReRender(ref);
            }

            _context.next = 30;
            break;

          case 27:
            _context.prev = 27;
            _context.t0 = _context["catch"](0);
            (0, _catchCcError["default"])(_context.t0);

          case 30:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 27]]);
  }));
  return _executeCuInfo.apply(this, arguments);
}