"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _register = _interopRequireDefault(require("../core/base/register"));

var _util = require("../support/util");

/****
 * @param {string} ccClassKey a cc class's name, you can register a same react class to cc with different ccClassKey,
 * but you can not register multi react class with a same ccClassKey!
 * @param {object} registerOption
 * @param {string} [registerOption.module] declare which module current cc class belong to, default is '$$default'
 * @param {Function} [registerOption.setup]
 * @param {Array<string>|string} [registerOption.watchedKeys] 
 * declare current cc class's any instance is concerned which state keys's state changing,
 * @param {{ [moduleName:string]: keys: string[] | '*' }} [registerOption.connect]
 * ```
 *    this.ctx.dispatch({type:'doStaff', payload:{foo:1, bar:2}});
 *    // or 
 *    this.ctx.dispatch('doStaff', {foo:1, bar:2});
 *    // or
 *    this.ctx.dispatch('moduleName/doStaff', {foo:1, bar:2});
 * ```
 * @param {string} [registerOption.isPropsProxy] default is false
 * cc alway use strategy of reverse inheritance to wrap your react class, that meas you can call cc instance method from `this` directly
 * but if you meet multi decorator in your legacy project and want to change it to cc, to make it still works well in cc mode,
 * you can set isPropsProxy as true, then cc will use strategy of prop proxy to wrap your react class, in this situation, 
 * all the cc instance method and property you can get them from both `this.props` and `this.`, for example
 * ```
 *    @cc.register({
 *      connect: {'form': ['regularFormSubmitting']},
 *      isPropsProxy: true 
 *    },'BasicForms')
 *    @Form.create()
 *    export default class BasicForms extends PureComponent {
 *      componentDidMount()=>{
 *        this.props.$$dispatch('form/getInitData');
 *      }
 *      render(){
 *        const {regularFormSubmitting} = this.props.$$connectedState.from;
 *      }
 *    }
 * ```
 * more details you can see https://github.com/fantasticsoul/rcc-antd-pro/blob/master/src/routes/Forms/BasicForm.js
 * @param {string} [registerOption.isSingle] default is false
 * if you only allow current cc class only initialize one time, 
 * that means there is only one cc instance can be existed for current cc class at most,
 * you can define registerOption.isSingle as true, it just like singleton mode in java coding^_^
 */
function _default(registerOption, ccClassKey) {
  var _registerOption = (0, _util.getRegisterOptions)(registerOption);

  delete _registerOption.__checkStartUp;
  delete _registerOption.__calledBy;
  return (0, _register["default"])(_registerOption, ccClassKey);
}