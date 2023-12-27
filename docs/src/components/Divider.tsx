

export type DividerProps ={
    visible?:boolean
    title?:string
}
export const Divider:React.FC<DividerProps> = (props)=>{
    const { title,visible=true } =props
    return (<div style={{
        height: "36px",
        borderBottom:"1px solid #eee",
        marginBottom:"16px",
        display: visible ? 'flex' : 'none'
    }}>
        <h4 style={{position:'absolute',background:'white',padding:"4px",color:"#bbb"}}>{title}</h4>
    </div>)
}
