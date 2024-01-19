import { ReactNode,ButtonHTMLAttributes } from "react"
import { ResetIcon } from "./Reset"
import { SaveIcon } from "./Save"

export interface IconButtonProps extends  ButtonHTMLAttributes<HTMLButtonElement> {
  name:"save" | 'reset'
}

const icons:Record<string,ReactNode> = {
  save:<SaveIcon/>,
  reset:<ResetIcon/>
}
export const IconButton:React.FC<IconButtonProps> = (props)=>{
  return <button style={{
    margin:"4px",
    width:"32px",
    height:"32px",
    padding:"8px",
    cursor:"pointer",
    borderRadius:"24px"
  }}  {...props} type="button">{icons[props.name]}</button>
}
