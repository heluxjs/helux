import { share } from "helux";

const [codeContext,setCodeContext] = share<{
  key:string,
  code:string,
  defaultString?:string

}>({key:"",code:"",})


export {
  codeContext,
  setCodeContext
}
