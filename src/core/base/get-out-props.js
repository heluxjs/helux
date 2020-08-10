
export default function (props) {
  if (props) {
    return props.props || props;//把最外层的props传递给用户
  } else {
    return {};
  }
}
