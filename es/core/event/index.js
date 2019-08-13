import util from '../../support/util';
import ccContext from '../../cc-context';

const { event_handlers_, handlerKey_handler_, ccUKey_handlerKeys_, ccUkey_ref_} = ccContext;

function _findEventHandlers(event, module, ccClassKey, identity = null) {
  const handlers = event_handlers_[event];
  if (handlers) {
    let filteredHandlers;

    if (ccClassKey) filteredHandlers = handlers.filter(v => v.ccClassKey === ccClassKey);
    else if (module) filteredHandlers = handlers.filter(v => v.module === module);
    else filteredHandlers = handlers;

    // identity is null means user call emit or emitIdentity which set identity as null
    // identity is not null means user call emitIdentity
    filteredHandlers = filteredHandlers.filter(v => v.identity === identity);
    return filteredHandlers;
  } else {
    return [];
  }
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
      event_handlers_[event] = eHandlers.filter(v => v !== null);//delete event_handlers_
    }
  });
}


export function bindEventHandlerToCcContext(module, ccClassKey, ccUniqueKey, event, identity, handler) {
  const handlers = util.safeGetArrayFromObject(event_handlers_, event);
  if (typeof handler !== 'function') {
    return util.justWarning(`event ${event}'s handler is not a function!`);
  }
  const targetHandlerIndex = handlers.findIndex(v => v.ccUniqueKey === ccUniqueKey && v.identity === identity);
  const handlerKeys = util.safeGetArrayFromObject(ccUKey_handlerKeys_, ccUniqueKey);
  const handlerKey = util.makeHandlerKey(ccUniqueKey, event, identity);
  //  that means the component of ccUniqueKey mounted again 
  //  or user call $$on for a same event in a same instance more than once
  const handlerItem = { event, module, ccClassKey, ccUniqueKey, identity, handlerKey, fn: handler };
  if (targetHandlerIndex > -1) {
    //  cc will alway use the latest handler
    handlers[targetHandlerIndex] = handlerItem;
  } else {
    handlers.push(handlerItem);
    handlerKeys.push(handlerKey);
  }
  handlerKey_handler_[handlerKey] = handlerItem;
}

export function findEventHandlersToPerform(event, ...args) {
  let _event = '', _identity = null, _module = null, _ccClassKey = null;
  if (typeof event === 'string') {
    _event = event;
  } else {
    _event = event.name;
    _identity = event.identity;
    _module = event.module;
    _ccClassKey = event.ccClassKey;
  }

  const handlers = _findEventHandlers(_event, _module, _ccClassKey, _identity);
  handlers.forEach(({ ccUniqueKey, handlerKey }) => {
    if (ccUkey_ref_[ccUniqueKey] && handlerKey) {//  confirm the instance is mounted and handler is not been offed
      const handler = handlerKey_handler_[handlerKey];
      if (handler) handler.fn(...args);
    }
  });
}

export function findEventHandlersToOff(event, { module, ccClassKey, identity }) {
  const handlers = _findEventHandlers(event, module, ccClassKey, identity);
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

export function getEventItem(event, curStateModule, ccClassKey) {
  //不检查array了... 要求用户需正确传递参数
  if (typeof event === 'object') {
    let _event, _ctx;
    if (Array.isArray(event)) {
      const [name, identity, ctx] = event;
      _event = { name, identity };
      _ctx = ctx;
    } else {
      _event = Object.assign({}, event);
      _ctx = event.ctx;
    }
    if (_ctx === true) {
      _event.module = curStateModule;
      _event.ccClassKey = ccClassKey;
    }

    //否则就允许用户传如自己定义的module, ccClassKey
    return _event;
  } else {
    return { name: event };
  }
}