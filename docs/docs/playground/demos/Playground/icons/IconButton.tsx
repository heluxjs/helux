import { ReactNode,ButtonHTMLAttributes } from "react"
import { ResetIcon } from "./Reset"
import { SaveIcon } from "./Save"

export interface IconButtonProps extends  ButtonHTMLAttributes<HTMLButtonElement> {
  name:"save" | 'reset'
}

const defaultStyle = {
  width:"52px",
  height:"28x",
  cursor:"pointer",
  borderRadius:"12px",
  textAlign: 'center',
};

const icons:Record<string,ReactNode> = {
  save:<SaveIcon/>,
  reset:<ResetIcon/>,
  run: 'Run',
  copy: 'Copy',
}
export const IconButton:React.FC<IconButtonProps> = (props)=>{
  const { name, style, ...rest } = props;
  console.log('style', style);
  const uiName = icons[name] || name;
  const stBtn = Object.assign({}, defaultStyle, style || {});
  return <button style={stBtn} {...rest} type="button">{uiName}</button>
}
