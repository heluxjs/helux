/**
 *
 * 工具栏组件，
 *
 *
 *
 */
import React, { useCallback  } from "react";
import { codeContext } from "./codeContext";

// export interface ToolsProps{

// }
export const Tools:React.FC  = ()=>{

  const saveCode =  useCallback(()=>{
    console.log(codeContext.key," = ",codeContext.code)
  },[])

  return <div style={{
    position:"relative",
    display:"flex",
    padding:"8px",
    boxSizing:"border-box",
    backgroundColor:"#fff"
  }}>
      <button style={{padding:"4px"}} type="button" onClick={()=>saveCode()}>保存</button>
      <button style={{padding:"4px"}} type="button" onClick={()=>{}}>恢复</button>
    </div>
}
