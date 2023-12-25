

```ts
import { useState, useMemo, useCallback, useRef } from 'react';

function Demo() {
  const [num, setNum] = useState(1); // ✅ 

  const fn = useCallback(() => { }, []); // ✅ 

  const val = useMemo(() => 1, []); // ✅ 

  const ref = useRef(1); // ✅ 
}

function Trap1(){
  const [num, setNum] = useState(1);

  const fn = useCallback(() => { 
    callSomeMethod(num); // ❌ 旧值
  }, []);
}


function Trap1(){
  const [num, setNum] = useState(1);

  const logic = async ()=>{
    if(xxxx){
      setNum(2);
    }else{
      setNum(2);
    }
    await someFetch();
    callSomeMethod(num); // ❌ 旧值
  }


  <Editor={()=>logic(num)} />;
}

```
