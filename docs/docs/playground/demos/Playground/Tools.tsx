/**
 *
 * 工具栏组件，
 *
 *
 *
 */
import React, { useCallback } from "react";
import { codeContext, setCodeContext } from "./codeContext";
import { IconButton } from "./icons/IconButton";
import localforage from 'localforage';


export const Tools: React.FC = () => {

  const saveCode = useCallback(() => {
    localforage.setItem(`helux_code_${codeContext.key}`, codeContext.code, (err) => {
      if (err) {
        console.error(err)
      } else {
        console.info('code is saved')
      }
    })
  }, [])

  const resetCode = useCallback(() => {
    localforage.removeItem(`helux_code_${codeContext.key}`, (err) => {
      if (!err) {
        setCodeContext(draft => { draft.code = '' })
      }
    })
  }, [])

  return <div style={{
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    padding: "8px",
    boxSizing: "border-box",
    backgroundColor: "transparent",
    left: "50%",
    top: "36px",
    width: "60px",
    right: "10px",
  }}>
    <IconButton name="save" title="保存代码" onClick={() => saveCode()} />
    <IconButton name="reset" title="恢复代码" onClick={() => resetCode()} />
  </div>
}
