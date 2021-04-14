import configure from '../../api/configure';
import { CC_CUSTOMIZE } from '../../support/constant';
import getModuleName from '../param/get-module-name';

export default function (moduleRaw, moduleName, asTag) {
  const finalModuleName = getModuleName(moduleName, asTag);
  configure(finalModuleName, moduleRaw);
}
