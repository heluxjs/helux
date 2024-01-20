import { share } from "helux";



const [codeContext,setCodeContext,codeCtx] = share<{
  key:string,
  code:string

}>({key:"",code:"",})


export {
  codeContext,
  setCodeContext,
  codeCtx
}
