/**
 * 每次渲染时变化颜色
 */

import React  from 'react';
import { styled } from "styledfc"

export function GithubIcon(props:any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" {...props}><path fill="currentColor" fillRule="evenodd" d="M11.999 1C5.926 1 1 5.925 1 12c0 4.86 3.152 8.983 7.523 10.437c.55.102.75-.238.75-.53c0-.26-.009-.952-.014-1.87c-3.06.664-3.706-1.475-3.706-1.475c-.5-1.27-1.221-1.61-1.221-1.61c-.999-.681.075-.668.075-.668c1.105.078 1.685 1.134 1.685 1.134c.981 1.68 2.575 1.195 3.202.914c.1-.71.384-1.195.698-1.47c-2.442-.278-5.01-1.222-5.01-5.437c0-1.2.428-2.183 1.132-2.952c-.114-.278-.491-1.397.108-2.91c0 0 .923-.297 3.025 1.127A10.536 10.536 0 0 1 12 6.32a10.49 10.49 0 0 1 2.754.37c2.1-1.424 3.022-1.128 3.022-1.128c.6 1.514.223 2.633.11 2.911c.705.769 1.13 1.751 1.13 2.952c0 4.226-2.572 5.156-5.022 5.428c.395.34.747 1.01.747 2.037c0 1.47-.014 2.657-.014 3.017c0 .295.199.637.756.53C19.851 20.979 23 16.859 23 12c0-6.075-4.926-11-11.001-11"></path></svg>
  )
}

export function  HomeIcon(props:any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" {...props}><path fill="none" stroke="currentColor" d="M1 22V9.76a2 2 0 0 1 .851-1.636l9.575-6.72a1 1 0 0 1 1.149 0l9.574 6.72A2 2 0 0 1 23 9.76V22a1 1 0 0 1-1 1h-5.333a1 1 0 0 1-1-1v-5.674a1 1 0 0 0-1-1H9.333a1 1 0 0 0-1 1V22a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1z"></path></svg>
  )
}
export type ProjectProps = React.PropsWithChildren<{
  name: string;
  logo?: string
  repo?: string
  website?: string
  description?:string
}>;

export default styled<ProjectProps>((props,{className})=>{
  return (<div className={className}>
    <a className="logo"  target="_blank" title="访问官网" href={props.website}><img src={props.logo}/></a>
    <span className="content">
      <div className='title'>{props.name}</div>
      <div className='description'>{props.description}</div>
    </span>
    <a className="repo" target="_blank" title="开源仓库"  href={props.repo}><GithubIcon/></a>
  </div>)

},{
  display: 'flex',
  flexDirection: 'row',
  border:"1px solid #ccc",
  margin: '8px',
  "&:hover":{
    border:"1px solid #18baff",
  },
  "& > .logo":{
    backgroundColor: '#eaeaea',
    width: "64px",
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection:'column',
    "& > img":{
      width: "32px",
      height: "32px",
      borderRadius:"32px"
    }
  },
  "& > .content":{
    padding:"8px",
    flexGrow:1,
    "& > .title":{
        fontWeight:'bold'
    },
    "& > .description":{
      paddingTop:"4px",

      color:"gray"
    }
  },
  "& > .website":{
    width: "32px",
    height: "32px",
    "& > svg":{
      paddingTop:"16px",
      color:"gray"
    }
  },
  "& > .repo":{
    width: "64px",
    height: "64px",
    textAlign:"center",
    "& > svg":{
      paddingTop:"16px",
      color:"gray"
    }

  }

})


