/**
 * 每次渲染时变化颜色
 */

import React, { ReactNode } from 'react';
import { styled } from "styledfc"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { ReactFC } from '../types';

export type ProjectProps = React.PropsWithChildren<{
  name: string;
  repo?: string
  logo?: string
  homepage?: string
  description?:string
}>;


export const Project = styled<ProjectProps>((props,{className})=>{
  return (<div className={className}>
    <span className="logo" ><img src={props.logo}/></span>
    <span className="content">
      <h2>{props.name}</h2>
      <p>{props.description}</p>
    </span>
    <span className="homepage"><img src={props.logo}/></span>
    <span className="repo"><img src={props.logo}/></span>
  </div>)

},{
  display: 'flex',
  flexDirection: 'row',
  border:"1px solid #bbb",
  margin: '8px',
  padding: '12px',
  height:"48px",
  backgroundColor: '#ebebeb',
  "& .logo":{
  }
})

