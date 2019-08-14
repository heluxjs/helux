"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

exports.__esModule = true;
exports.bindEventHandlerToCcContext = bindEventHandlerToCcContext;
exports.findEventHandlersToPerform = findEventHandlersToPerform;
exports.findEventHandlersToOff = findEventHandlersToOff;
exports.offEventHandlersByCcUniqueKey = offEventHandlersByCcUniqueKey;
exports.getEventItem = getEventItem;

var util = _interopRequireWildcard(require("../../support/util"));

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var event_handlers_ = _ccContext["default"].event_handlers_,
    handlerKey_handler_ = _ccContext["default"].handlerKey_handler_,
    ccUKey_handlerKeys_ = _ccContext["default"].ccUKey_handlerKeys_,
    ccUkey_ref_ = _ccContext["default"].ccUkey_ref_;
var makeHandlerKey = util.makeHandlerKey,
    safeGetArrayFromObject = util.safeGetArrayFromObject,
    justWarning = util.justWarning;

function _findEventHandlers(event, module, ccClassKey, ccUniqueKey, identity) {
  if (identity === void 0) {
    identity = null;
  }

  var handlers = event_handlers_[event];

  if (handlers) {
    var filteredHandlers = handlers;
    if (ccUniqueKey) filteredHandlers = handlers.filter(function (v) {
      return v.ccUniqueKey === ccUniqueKey;
    });else if (ccClassKey) filteredHandlers = handlers.filter(function (v) {
      return v.ccClassKey === ccClassKey;
    });else if (module) filteredHandlers = handlers.filter(function (v) {
      return v.module === module;
    }); // identity is null means user call emit like emit('eventName')
    // identity is not null means user call emit like emit(['eventName', 'idtName'])

    if (identity !== undefined) {
      filteredHandlers = filteredHandlers.filter(function (v) {
        return v.identity === identity;
      });
    }

    return filteredHandlers;
  }

  return [];
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
          delete ccUKey_handlerKeys_[ccUniqueKey]; //delete mapping of ccUKey_handlerKeys_;
        }
      });
      event_handlers_[event] = eHandlers.filter(function (v) {
        return v !== null;
      }); //delete eHandlers null element
    }
  });
}

function bindEventHandlerToCcContext(module, ccClassKey, ccUniqueKey, event, identity, handler) {
  var handlers = safeGetArrayFromObject(event_handlers_, event);

  if (typeof handler !== 'function') {
    return justWarning("event " + event + "'s handler is not a function!");
  }

  var handlerKey = makeHandlerKey(ccUniqueKey, event, identity);
  var handlerKeys = safeGetArrayFromObject(ccUKey_handlerKeys_, ccUniqueKey);
  var targetHandlerIndex = handlers.findIndex(function (v) {
    return v.handlerKey === handlerKey;
  }); // user call ctx.on for a same event in a same instance more than once

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
    // will alway use the latest handler
    handlers[targetHandlerIndex] = handlerItem;
  } else {
    handlers.push(handlerItem);
    handlerKeys.push(handlerKey);
  }

  handlerKey_handler_[handlerKey] = handlerItem;
}

function findEventHandlersToPerform(event) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  var _event,
      _identity = null,
      _module,
      _ccClassKey,
      _ccUniqueKey;

  if (typeof event === 'string') {
    _event = event;
  } else {
    _event = event.name;
    _identity = event.identity;
    _module = event.module;
    _ccClassKey = event.ccClassKey;
    _ccUniqueKey = event.ccUniqueKey;
  }

  var handlers = _findEventHandlers(_event, _module, _ccClassKey, _ccUniqueKey, _identity);

  handlers.forEach(function (_ref) {
    var ccUniqueKey = _ref.ccUniqueKey,
        handlerKey = _ref.handlerKey;

    if (ccUkey_ref_[ccUniqueKey] && handlerKey) {
      //  confirm the instance is mounted and handler is not been offed
      var handler = handlerKey_handler_[handlerKey];
      if (handler) handler.fn.apply(handler, args);
    }
  });
}

function findEventHandlersToOff(event, _ref2) {
  var module = _ref2.module,
      ccClassKey = _ref2.ccClassKey,
      ccUniqueKey = _ref2.ccUniqueKey,
      identity = _ref2.identity;

  var handlers = _findEventHandlers(event, module, ccClassKey, ccUniqueKey, identity);

  _deleteEventHandlers(handlers);
}

function offEventHandlersByCcUniqueKey(ccUniqueKey) {
  var handlerKeys = ccUKey_handlerKeys_[ccUniqueKey];

  if (handlerKeys) {
    var toDeleteHandlers = [];
    handlerKeys.forEach(function (k) {
      return toDeleteHandlers.push(handlerKey_handler_[k]);
    });

    _deleteEventHandlers(toDeleteHandlers);
  }
}

function getEventItem(event) {
  if (typeof event === 'object') {
    var _event;

    if (Array.isArray(event)) {
      var name = event[0],
          identity = event[1];
      _event = {
        name: name,
        identity: identity
      };
    } else {
      _event = Object.assign({}, event);
    } //否则就允许用户传如自己定义的module, ccClassKey


    return _event;
  } else {
    return {
      name: event
    };
  }
}