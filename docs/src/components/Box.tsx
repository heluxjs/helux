/**
 * 每次渲染时变化颜色
 */


import React from "react"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { ReactFC } from "../types";

export type BoxProps = React.PropsWithChildren<{
  visible?:boolean
  title?:string
  enable?:boolean
}>

const Box:ReactFC<BoxProps> = (props)=>{
  const { title,enable=true,visible=true } =props
  return (
    <div  style={{ 
        display: visible ? 'flex' : 'none',
        position:"relative",
        flexDirection:'column',
        padding:"8px",
        margin:"16px 4px 4px 4px",
        boxSizing:"border-box",
        border:`1px solid #bbb`,
    }}>            
        <span style={{
          position:'absolute',
          padding:"2px 4px 2px 4px",
          top:"-16px",
          background:'white',
          left: "8px",
          color:enable ? '#bbb'  : 'gray'
        }}>{title || ''}</span>
        {props.children}
    </div>
  );
};
      

export default Box