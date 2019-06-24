
import connectDumb from './connect-dumb';


export default ({ module, mapProps, mapState, connect, state, setup, bindCtxToMethod } = {}) => {
  if (mapState) throw new Error('mapState is not allowed in connectPure method args');
  let _mapProps = mapProps;
  if (!mapProps) _mapProps = () => { };
  return connectDumb({ module, mapProps: _mapProps, connect, state, setup, bindCtxToMethod });
}
