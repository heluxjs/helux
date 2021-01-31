import * as util from '../../support/util';
import { MOUNTED } from '../../support/constant';
import { INAF } from '../../support/priv-constant';
import ccContext from '../../cc-context';

const { event2handlers, handlerKey2handler, ccUKey2handlerKeys, ccUKey2ref } = ccContext;
const { makeHandlerKey, safeGetArray, justWarning } = util;

function _findEventHandlers(event, module, ccClassKey, ccUniqueKey, identity) {
  // 不用默认参数写法了
  // codesandbox lost default value
  const _identity = identity == undefined ? null : identity;

  // 查找的时候，只负责取，不负责隐式的生成，此次不需要用safeGetArray
  const handlers = event2handlers[event];
  if (handlers) {
    let filteredHandlers = handlers;

    if (ccUniqueKey) filteredHandlers = handlers.filter(v => v.ccUniqueKey === ccUniqueKey);
    else if (ccClassKey) filteredHandlers = handlers.filter(v => v.ccClassKey === ccClassKey);
    else if (module) filteredHandlers = handlers.filter(v => v.module === module);

    // identity is null means user call emit like emit('eventName')
    // identity is not null means user call emit like emit(['eventName', 'idtName'])
    if (_identity !== undefined) {
      filteredHandlers = filteredHandlers.filter(v => v.identity === _identity);
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
    delete handlerKey2handler[handlerKey];//delete mapping of handlerKey2handler;
    toDeleteHandlerKeyMap[handlerKey] = 1;
    toDeleteCcUniqueKeyMap[ccUniqueKey] = 1;
    if (!toDeleteEventNames.includes(event)) toDeleteEventNames.push(event);
  });

  toDeleteEventNames.forEach(event => {
    const eHandlers = event2handlers[event];
    if (eHandlers) {
      eHandlers.forEach((h, idx) => {
        const { ccUniqueKey } = h;
        if (toDeleteCcUniqueKeyMap[ccUniqueKey] === 1) {
          eHandlers[idx] = null;
          delete ccUKey2handlerKeys[ccUniqueKey];//delete mapping of ccUKey2handlerKeys;
        }
      });
      event2handlers[event] = eHandlers.filter(v => v !== null);//delete eHandlers null element
    }
  });
}


export function bindEventHandlerToCcContext(module, ccClassKey, ccUniqueKey, event, identity, handler) {
  const handlers = safeGetArray(event2handlers, event);
  if (!util.isFn(handler)) {
    return justWarning(`event ${event}'s handler ${INAF}!`);
  }

  const handlerKey = makeHandlerKey(ccUniqueKey, event, identity);
  const handlerKeys = safeGetArray(ccUKey2handlerKeys, ccUniqueKey);
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
  handlerKey2handler[handlerKey] = handlerItem;
}

export function findEventHandlersToPerform(event, ...args) {
  let _event, _identity = null, _module, _ccClassKey, _ccUniqueKey;
  let canPerform = null;
  if (typeof event === 'string') {
    _event = event;
  } else {
    _event = event.name;
    _identity = event.identity;
    _module = event.module;
    _ccClassKey = event.ccClassKey;
    _ccUniqueKey = event.ccUniqueKey;
    canPerform = event.canPerform;
  }

  const handlers = _findEventHandlers(_event, _module, _ccClassKey, _ccUniqueKey, _identity);
  handlers.forEach(({ ccUniqueKey, handlerKey }) => {
    const ref = ccUKey2ref[ccUniqueKey];
    if (ref && handlerKey) {//  confirm the instance is mounted and handler is not been offed
      if (ref.__$$isUnmounted) return;

      const handler = handlerKey2handler[handlerKey];
      if (handler) {
        if (canPerform && !canPerform(ref)) {
          return;
        }
        if (ref.__$$ms === MOUNTED) handler.fn(...args);
      }
    }
  });
}

export function findEventHandlersToOff(event, { module, ccClassKey, ccUniqueKey, identity }) {
  const handlers = _findEventHandlers(event, module, ccClassKey, ccUniqueKey, identity);
  _deleteEventHandlers(handlers);
}

export function offEventHandlersByCcUniqueKey(ccUniqueKey) {
  const handlerKeys = ccUKey2handlerKeys[ccUniqueKey];
  if (handlerKeys) {
    const toDeleteHandlers = [];
    handlerKeys.forEach(k => toDeleteHandlers.push(handlerKey2handler[k]));
    _deleteEventHandlers(toDeleteHandlers);
  }
}

export function getEventItem(event) {
  let outputEv;
  if (event && typeof event === 'object') {
    let _event;
    if (Array.isArray(event)) {
      const [name, identity] = event;
      _event = { name, identity };
    } else {
      _event = Object.assign({}, event);
    }
    if (!_event.identity) _event.identity = null;

    //否则就允许用户传如自己定义的module, ccClassKey
    outputEv = _event;
  } else {
    outputEv = { name: event, identity: null };
  }

  return outputEv;
}
