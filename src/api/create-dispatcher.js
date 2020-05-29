import buildRefCtx from '../core/ref/build-ref-ctx';
import mapRegistrationInfo from '../core/base/map-registration-info';
import { CC_DISPATCHER, MODULE_DEFAULT, CC_CLASS } from '../support/constant';
import ccContext from '../cc-context';

const noop = () => { };

export default function () {
  const ccClassKey = CC_DISPATCHER;
  mapRegistrationInfo(
    MODULE_DEFAULT, ccClassKey, '', CC_CLASS, [], [], [], false, 'cc'
  );

  const mockRef = { setState: noop, forceUpdate: noop };
  buildRefCtx(mockRef, {
    module: MODULE_DEFAULT, ccClassKey, state: {},
  });
  ccContext.permanentDispatcher = mockRef;
}