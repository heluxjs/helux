import util from '../../support/util';
import ccContext from '../../cc-context';

const { event_handlers_, handlerKey_handler_, ccUniqueKey_handlerKeys_, ccKey_ref_} = ccContext;

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
          delete ccUniqueKey_handlerKeys_[ccUniqueKey];//delete mapping of ccUniqueKey_handlerKeys_;
        }
      });
      event_handlers_[event] = eHandlers.filter(v => v !== null);//delete event_handlers_
    }
  });
}


export function bindEventHandlerToCcContext(module, ccClassKey, ccUniqueKey, event, identity, handler) {
  const handlers = util.safeGetArrayFromObject(event_handlers_, event);
  if (typeof handler !== 'function') {
    return justWarning(`event ${event}'s handler is not a function!`);
  }
  const targetHandlerIndex = handlers.findIndex(v => v.ccUniqueKey === ccUniqueKey && v.identity === identity);
  const handlerKeys = util.safeGetArrayFromObject(ccUniqueKey_handlerKeys_, ccUniqueKey);
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

export function findEventHandlersToPerform(event, { module, ccClassKey, identity }, ...args) {
  const handlers = _findEventHandlers(event, module, ccClassKey, identity);
  handlers.forEach(({ ccUniqueKey, handlerKey }) => {
    if (ccKey_ref_[ccUniqueKey] && handlerKey) {//  confirm the instance is mounted and handler is not been offed
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
  const handlerKeys = ccUniqueKey_handlerKeys_[ccUniqueKey];
  if (handlerKeys) {
    const toDeleteHandlers = [];
    handlerKeys.forEach(k => toDeleteHandlers.push(handlerKey_handler_[k]));
    _deleteEventHandlers(toDeleteHandlers);
  }
}
