/**
 *
 * 工具栏组件，
 *
 *
 *
 */
import React from "react";
import { IconButton } from "./icons/IconButton";

const stControlWrap= { width: '156px', transform: 'translateX(-105px)' };
const stWrap = {
  position: "absolute",
  display: "flex",
  flexDirection: "column",
  padding: "8px",
  boxSizing: "border-box",
  backgroundColor: "transparent",
  left: "50%",
  top: "26px",
  width: "60px",
  transform: 'translateX(-15px)',
};

export const Tools: React.FC = (props: any) => {
  const { mode, onControlClick, onRunClick, copyUrl, saveCode, resetCode, recoverCode } = props;
  const liveBtnStyle = mode === 'live'? { backgroundColor: 'lightskyblue' } : {};
  const lagBtnStyle = mode === 'lag'? { backgroundColor: 'lightskyblue' } : {};
  const manualBtnStyle = mode === 'manual'? { backgroundColor: 'lightskyblue' } : {};

  return <div style={stWrap}>
    <div style={stControlWrap}>
      <IconButton 
        name="实时" 
        title="预览区实时响应编辑器代码" 
        style={liveBtnStyle} 
        onClick={()=>onControlClick('live')} 
      />
      <IconButton 
        name="延时" 
        title="预览区延时响应编辑器代码" 
        style={lagBtnStyle} 
        onClick={()=>onControlClick('lag')} 
      />
      <IconButton 
        name="手动" 
        title="手动点击运行后，预览区才响应编辑器代码" 
        style={manualBtnStyle} 
        onClick={()=>onControlClick('manual')} 
      />
    </div>
    <IconButton name="重置" title="重置代码" onClick={resetCode} />
    {(mode === 'manual' || mode === 'lag') && <IconButton name="保存" title="保存代码" onClick={() => saveCode()} />}
    <IconButton name="恢复" title="恢复保存代码" onClick={recoverCode} />
    {mode === 'manual' && <IconButton name="运行" title="运行代码" onClick={() => onRunClick?.()} />}
    <IconButton name="copy" title="复制当前示例链接" onClick={() => copyUrl?.()} />
  </div>
}
