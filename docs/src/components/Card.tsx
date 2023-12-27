/**
 * 每次渲染时变化颜色
 */


import React, { ReactNode } from "react"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { ReactFC } from "../types";

export type CardProps = React.PropsWithChildren<{
  title?:string
  buttons?:ReactFC[],
  visible?:boolean
  enable?:boolean
  footer?:ReactNode
}>

const Card:ReactFC<CardProps> = (props)=>{
  const { title,enable=true,visible=true,buttons=[] } =props

        return (
          <div style={{ 
              border:`1px solid #bbb`,
              background: enable ? "white" : 'gray',
              margin:"8px" ,
              display: visible ? 'flex' : 'none',
              flexDirection:"column",              
          }}>
            <div  style={{display:"flex",flexDirection:"row",backgroundColor:"#ebebeb",padding:"6px",lineHeight:"150%"}}>
                <span style={{color:enable ? "#222" : 'gray'}}>{title}</span>
                {buttons.map(Btn=><Btn/>)}
            </div>
            <div style={{ padding:"12px" }}>
                {props.children}
            </div>
          </div>
        );
      };
      

export default Card