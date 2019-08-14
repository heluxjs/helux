import * as util from '../../support/util';
import ccContext from '../../cc-context';

const { event_handlers_, handlerKey_handler_, ccUKey_handlerKeys_, ccUkey_ref_} = ccContext;
const { makeHandlerKey, safeGetArrayFromObject, justWarning } = util;

function _findEventHandlers(event, module, ccClassKey, ccUniqueKey, identity = null) {
  const handlers = event_handlers_[event];
  if (handlers) {
    let filteredHandlers = handlers;

    if (ccUniqueKey) filteredHandlers = handlers.filter(v => v.ccUniqueKey === ccUniqueKey);
    else if (ccClassKey) filteredHandlers = handlers.filter(v => v.ccClassKey === ccClassKey);
    else if (module) filteredHandlers = handlers.filter(v => v.module === module);

    // identity is null means user call emit like emit('eventName')
    // identity is not null means user call emit like emit(['eventName', 'idtName'])
    if (identity !== undefined) {
      filteredHandlers = filteredHandlers.filter(v => v.identity === identity);
    }
    return filteredHandlers;
  }
  return [];
}

function _deleteEventHandlers(handlers) {
  const toDeleteHandlerKeyMap = {};
  const toDeleteCcUniqueKeyMap = {};
  const toDeleteEventNames = [];
  handlers.forEach(item => {
    const { handlerKey, ccUniqueKey, event } = item;
    delete handlerKey_handler_[handlerKey];//delete mapping of handlerKey_handler_;
    toDeleteHandlerKeyMap[handlerKey] = 1;
    toDeleteCcUniqueKeyMap[ccUniqueKey] = 1;
    if (!toDeleteEventNames.includes(event)) toDeleteEventNames.push(event);
  });

  toDeleteEventNames.forEach(event => {
    const eHandlers = event_handlers_[event];
    if (eHandlers) {
      eHandlers.forEach((h, idx) => {
        const { ccUniqueKey } = h;
        if (toDeleteCcUniqueKeyMap[ccUniqueKey] === 1) {
          eHandlers[idx] = null;
          delete ccUKey_handlerKeys_[ccUniqueKey];//delete mapping of ccUKey_handlerKeys_;
        }
      });
      event_handlers_[event] = eHandlers.filter(v => v !== null);//delete eHandlers null element
    }
  });
}


export function bindEventHandlerToCcContext(module, ccClassKey, ccUniqueKey, event, identity, handler) {
  const handlers = safeGetArrayFromObject(event_handlers_, event);
  if (typeof handler !== 'function') {
    return justWarning(`event ${event}'s handler is not a function!`);
  }

  const handlerKey = makeHandlerKey(ccUniqueKey, event, identity);
  const handlerKeys = safeGetArrayFromObject(ccUKey_handlerKeys_, ccUniqueKey);
  const targetHandlerIndex = handlers.findIndex(v => v.handlerKey === handlerKey);
  // user call ctx.on for a same event in a same instance more than once
  const handlerItem = { event, module, ccClassKey, ccUniqueKey, identity, handlerKey, fn: handler };
  if (targetHandlerIndex > -1) {
    // will alway use the latest handler
    handlers[targetHandlerIndex] = handlerItem;
  } else {
    handlers.push(handlerItem);
    handlerKeys.push(handlerKey);
  }
  handlerKey_handler_[handlerKey] = handlerItem;
}

export function findEventHandlersToPerform(event, ...args) {
  let _event, _identity = null, _module, _ccClassKey, _ccUniqueKey;
  if (typeof event === 'string') {
    _event = event;
  } else {
    _event = event.name;
    _identity = event.identity;
    _module = event.module;
    _ccClassKey = event.ccClassKey;
    _ccUniqueKey = event.ccUniqueKey;
  }

  const handlers = _findEventHandlers(_event, _module, _ccClassKey, _ccUniqueKey, _identity);
  handlers.forEach(({ ccUniqueKey, handlerKey }) => {
    if (ccUkey_ref_[ccUniqueKey] && handlerKey) {//  confirm the instance is mounted and handler is not been offed
      const handler = handlerKey_handler_[handlerKey];
      if (handler) handler.fn(...args);
    }
  });
}

export function findEventHandlersToOff(event, { module, ccClassKey, ccUniqueKey, identity }) {
  const handlers = _findEventHandlers(event, module, ccClassKey, ccUniqueKey, identity);
  _deleteEventHandlers(handlers);
}

export function offEventHandlersByCcUniqueKey(ccUniqueKey) {
  const handlerKeys = ccUKey_handlerKeys_[ccUniqueKey];
  if (handlerKeys) {
    const toDeleteHandlers = [];
    handlerKeys.forEach(k => toDeleteHandlers.push(handlerKey_handler_[k]));
    _deleteEventHandlers(toDeleteHandlers);
  }
}

export function getEventItem(event) {
  if (typeof event === 'object') {
    let _event;
    if (Array.isArray(event)) {
      const [name, identity] = event;
      _event = { name, identity };
    } else {
      _event = Object.assign({}, event);
    }

    //否则就允许用户传如自己定义的module, ccClassKey
    return _event;
  } else {
    return { name: event };
  }
}