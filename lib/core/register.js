"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _register = _interopRequireDefault(require("./helper/register"));

/****
 * @param {string} ccClassKey a cc class's name, you can register a same react class to cc with different ccClassKey,
 * but you can not register multi react class with a same ccClassKey!
 * @param {object} registerOption
 * @param {string} [registerOption.module] declare which module current cc class belong to, default is '$$default'
 * @param {Array<string>|string} [registerOption.sharedStateKeys] 
 * declare which state keys's state changing will shared to current cc class's module,
 * default is empty array, that means any state key's value changing will not effect it's module state,
 * if you define it like ['foo', 'bar'], when current cc instance change foo and bar, 
 * it will effect other cc instance only if any of them whose sharedStateKeys include any key of foo and bar,
 * and other cc instance change foo and bar will effect current cc instance also,
 * your can also define it as '*', it means current cc class will watch its module whole state,
 * note! the keys must have been declared in module state.
 * @param {Array<string>|string} [registerOption.globalStateKeys] 
 * declare which global keys's state changing the current class care about,
 * default is empty array, that means any state key's value changing will not effect global state,
 * note! the keys must have been declared in global state,
 * assume your global state like {gColor:'red', gWidth:200},
 * and you define globalStateKeys like ['gColor']，
 * when you current cc instance send a state to cc like {gColor:'blue', otherKey:'whatever'},
 * global state's gColor will been changed and any other cc instance if their globalStateKeys include gColor
 * will read the latest gColor value and render new view.
 * your can also define it as '*', it means current cc class will watch global module whole state,
 * ============   !!!!!!  ============
 * and pay attention key naming duplicate, because a cc instance's state is merged from global state、module state and self state,
 * so cc don't allow sharedStateKeys and globalStateKeys has duplicate element
 * 
 * @param {object} [registerOption.stateToPropMapping] { (moduleName/keyName)/(alias), ...}
 * if you don't like module state merge to cc instance state property, 
 * you can define stateToPropMapping, that means you can get module from this.$$propState in cc instance method,
 * for example, if you define it like: {'moudleA/foo':'foo', 'moudleB/bar':'bar'}
 * now your can get value of foo and bar from these two module,
 * ```
 *    const {foo, bar} = this.$$propState;
 * ```
 * ============   !!!!!!  ============
 * note that, any state changing of key for foo and bar will effect current cc class instance to render new view,
 * that means you can use this feature to achieve purpose of watching multi module state changing ^_^
 * 
 * if moudleA and moudleB has a duplicate key naming, you can define stateToPropMapping like:
 * {'moudleA/foo':'foo', 'moudleA/bar':'moudleA_bar','moudleB/bar':'bar'}
 * now your can get value of foo and bar from these two module like below,
 * ```
 *    const {foo, moudleA_bar, bar} = this.$$propState;
 * ```
 * if you want to want to watch moudleA and moudleB whole state changing 
 * and you can make sure they don't have key naming duplicate problem!
 * you can define stateToPropMapping like: {'moudleA/*':'', 'moudleB/*':''}
 * now your can get any key state from this.$$propState,
 * 
 * ============   !!!!!!  ============
 * a better way to avoid key naming duplicate problem is set registerOption.isPropStateModuleMode as true,
 * now your can these two moudle state like below, you can get every state from specified module^_^
 * ```
 *    const {moudleA, moudleB} = this.$$propState;
 * ```
 * 
 * @param {object} [registerOption.isPropStateModuleMode] default is false, see above know how to use it
 * @param {string} [registerOption.reducerModule] default is equal as module if you don't declare it
 * if you call cc instance api $$dispatch without module and reducerMoudle like below
 * ```
 *    this.$$dispatch({type:'doStaff', payload:{foo:1, bar:2}});
 *    // or 
 *    this.$$dispatch('doStaff', {foo:1, bar:2});
 * ```
 * cc will find current cc class's reducerModule function named doStaff to execute 
 * and will change current cc class's moudle state,
 * so you don't have to write code like below if current cc class module is M1 
 * and you always want to use R1 reducer function to generate new state
 * ```
 *    this.$$dispatch({module:'M1', reducerModule:'R1', type:'doStaff', payload:{foo:1, bar:2}});
 *    // or 
 *    this.$$dispatch('M1/R1/doStaff', {foo:1, bar:2});
 * ```
 * 
 * ============   !!!!!!  ============
 * note if you really want to change other module's state and use other reducer function, you must input module and reducerModule
 * in your $$dispatch method, or they will been replaced by current cc class's default module and default reducerModule
 * ```
 *    this.$$dispatch({module:'M2', reducerModule:'R2', type:'doStaff', payload:{foo:1, bar:2}});
 * ```
 * @param {string} [registerOption.extendInputClass] default is true
 * cc alway use strategy of reverse inheritance to wrap your react class, that meas you can call cc instance method from `this` directly
 * but if you meet multi decorator in your legacy project and want to change it to cc, to make it still works well in cc mode,
 * you can set extendInputClass as false, then cc will use strategy of prop proxy to wrap your react class, in this situation, 
 * all the cc instance method and property you can only get them from `this.props`, for example
 * ```
 *    @cc.register('BasicForms',{
 *      stateToPropMapping: {'form/regularFormSubmitting': 'submitting'},
 *      extendInputClass: false 
 *    })
 *    @Form.create()
 *    export default class BasicForms extends PureComponent {
 *      componentDidMount()=>{
 *        this.props.$$dispatch('form/getInitData');
 *      }
 *      render(){
 *        const {submitting} = this.props.$$propState;
 *      }
 *    }
 * ```
 * more details you can see https://github.com/fantasticsoul/rcc-antd-pro/blob/master/src/routes/Forms/BasicForm.js
 * @param {string} [registerOption.isSingle] default is false
 * if you only allow current cc class only initialize one time, 
 * that means there is only one cc instance can be existed for current cc class at most,
 * you can define registerOption.isSingle as true, it just like singleton mode in java coding^_^
 * @param {string} [registerOption.asyncLifecycleHook] default is true
 * we can define cc class lifecycle method $$beforeSetState、$$afterSetState、$$beforeBroadcastState,
 * but they are synchronous by default,
 * if you define registerOption.isSingle as true, these three method's second param will be next handler
 *  * ============   !!!!!!  ============
 *  you must call next, if you don't want to block any of next operation in cc core
 * ```
 * $$beforeSetState(executeContext, next){
 *  // here if you don't call next(), it will block reactSetState, broadcastState and etc operations ~_~
 * }
 * ```
 */
function _default(ccClassKey, registerOption) {
  if (registerOption) {
    delete registerOption.__checkStartUp;
    delete registerOption.__calledBy;
  }

  return (0, _register["default"])(ccClassKey, registerOption);
}