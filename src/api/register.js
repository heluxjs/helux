import register from '../core/base/register';
import { getRegisterOptions } from '../support/util';

/****
 * @param {string} ccClassKey a cc class's name, you can register a same react class to cc with different ccClassKey,
 * but you can not register multi react class with a same ccClassKey if they don't have same feature(module, connnect params)
 * @param {object} registerOption
 * @param {string} [registerOption.module] declare which module current cc class belong to, default is '$$default'
 * @param {Function} [registerOption.setup]
 * @param {Array<string>|string} [registerOption.watchedKeys] 
 * declare current cc class's any instance is concerned which state keys's state changing,
 * but mostly wo should not set this param cause concent will collect ins dep automatically
 * @param {{ [moduleName:string]: keys: string[] | '*' }} [registerOption.connect]
 * @param {string} [registerOption.isPropsProxy] default is false
 * cc alway use strategy of reverse inheritance to wrap your react class, that means you can get ctx from `this` directly
 * but if you meet multi decorator in your project, to let concent still works well you should set isPropsProxy as true, 
 * and call props.attach(this) in last line of constructor, then cc will use strategy of prop proxy to wrap your react class, 
 * for example
 * ```
 *    @register({ module: "form", isPropsProxy: true })
 *    @Form.create()
 *    class BasicForms extends PureComponent {
 *      constructor(props, context) {
 *        super(props, context);
 *        props.$$attach(this);// must call $$attach at last line of consturctor block
 *      }
 *      render(){
 *        this.ctx.moduleComputed; //now you can get render ctx supplied by concent
 *      }
 *   }
 * ```
 * online example here: https://codesandbox.io/s/register-in-multi-decrator-j4nr2
 */
export default function (registerOption, ccClassKey) {
  let _registerOption = getRegisterOptions(registerOption);
  delete _registerOption.__checkStartUp;
  delete _registerOption.__calledBy;

  return register(_registerOption, ccClassKey);
}
