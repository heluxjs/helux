"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.bindEventHandlerToCcContext = bindEventHandlerToCcContext;
exports.findEventHandlersToPerform = findEventHandlersToPerform;
exports.findEventHandlersToOff = findEventHandlersToOff;
exports.offEventHandlersByCcUniqueKey = offEventHandlersByCcUniqueKey;

var _util = _interopRequireDefault(require("../../support/util"));

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var event_handlers_ = _ccContext["default"].event_handlers_,
    handlerKey_handler_ = _ccContext["default"].handlerKey_handler_,
    ccUniqueKey_handlerKeys_ = _ccContext["default"].ccUniqueKey_handlerKeys_,
    ccKey_ref_ = _ccContext["default"].ccKey_ref_;

function _findEventHandlers(event, module, ccClassKey, identity) {
  if (identity === void 0) {
    identity = null;
  }

  var handlers = event_handlers_[event];

  if (handlers) {
    var filteredHandlers;
    if (ccClassKey) filteredHandlers = handlers.filter(function (v) {
      return v.ccClassKey === ccClassKey;
    });else if (module) filteredHandlers = handlers.filter(function (v) {
      return v.module === module;
    });else filteredHandlers = handlers; // identity is null means user call emit or emitIdentity which set identity as null
    // identity is not null means user call emitIdentity

    filteredHandlers = filteredHandlers.filter(function (v) {
      return v.identity === identity;
    });
    return filteredHandlers;
  } else {
    return [];
  }
}

function _deleteEventHandlers(handlers) {
  var toDeleteHandlerKeyMap = {};
  var toDeleteCcUniqueKeyMap = {};
  var toDeleteEventNames = [];
  handlers.forEach(function (item) {
    var handlerKey = item.handlerKey,
        ccUniqueKey = item.ccUniqueKey,
        event = item.event;
    delete handlerKey_handler_[handlerKey]; //delete mapping of handlerKey_handler_;

    toDeleteHandlerKeyMap[handlerKey] = 1;
    toDeleteCcUniqueKeyMap[ccUniqueKey] = 1;
    if (!toDeleteEventNames.includes(event)) toDeleteEventNames.push(event);
  });
  toDeleteEventNames.forEach(function (event) {
    var eHandlers = event_handlers_[event];

    if (eHandlers) {
      eHandlers.forEach(function (h, idx) {
        var ccUniqueKey = h.ccUniqueKey;

        if (toDeleteCcUniqueKeyMap[ccUniqueKey] === 1) {
          eHandlers[idx] = null;
          delete ccUniqueKey_handlerKeys_[ccUniqueKey]; //delete mapping of ccUniqueKey_handlerKeys_;
        }
      });
      event_handlers_[event] = eHandlers.filter(function (v) {
        return v !== null;
      }); //delete event_handlers_
    }
  });
}

function bindEventHandlerToCcContext(module, ccClassKey, ccUniqueKey, event, identity, handler) {
  var handlers = _util["default"].safeGetArrayFromObject(event_handlers_, event);

  if (typeof handler !== 'function') {
    return _util["default"].justWarning("event " + event + "'s handler is not a function!");
  }

  var targetHandlerIndex = handlers.findIndex(function (v) {
    return v.ccUniqueKey === ccUniqueKey && v.identity === identity;
  });

  var handlerKeys = _util["default"].safeGetArrayFromObject(ccUniqueKey_handlerKeys_, ccUniqueKey);

  var handlerKey = _util["default"].makeHandlerKey(ccUniqueKey, event, identity); //  that means the component of ccUniqueKey mounted again 
  //  or user call $$on for a same event in a same instance more than once


  var handlerItem = {
    event: event,
    module: module,
    ccClassKey: ccClassKey,
    ccUniqueKey: ccUniqueKey,
    identity: identity,
    handlerKey: handlerKey,
    fn: handler
  };

  if (targetHandlerIndex > -1) {
    //  cc will alway use the latest handler
    handlers[targetHandlerIndex] = handlerItem;
  } else {
    handlers.push(handlerItem);
    handlerKeys.push(handlerKey);
  }

  handlerKey_handler_[handlerKey] = handlerItem;
}

function findEventHandlersToPerform(event, _ref) {
  var module = _ref.module,
      ccClassKey = _ref.ccClassKey,
      identity = _ref.identity;

  for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  var handlers = _findEventHandlers(event, module, ccClassKey, identity);

  handlers.forEach(function (_ref2) {
    var ccUniqueKey = _ref2.ccUniqueKey,
        handlerKey = _ref2.handlerKey;

    if (ccKey_ref_[ccUniqueKey] && handlerKey) {
      //  confirm the instance is mounted and handler is not been offed
      var handler = handlerKey_handler_[handlerKey];
      if (handler) handler.fn.apply(handler, args);
    }
  });
}

function findEventHandlersToOff(event, _ref3) {
  var module = _ref3.module,
      ccClassKey = _ref3.ccClassKey,
      identity = _ref3.identity;

  var handlers = _findEventHandlers(event, module, ccClassKey, identity);

  _deleteEventHandlers(handlers);
}

function offEventHandlersByCcUniqueKey(ccUniqueKey) {
  var handlerKeys = ccUniqueKey_handlerKeys_[ccUniqueKey];

  if (handlerKeys) {
    var toDeleteHandlers = [];
    handlerKeys.forEach(function (k) {
      return toDeleteHandlers.push(handlerKey_handler_[k]);
    });

    _deleteEventHandlers(toDeleteHandlers);
  }
}