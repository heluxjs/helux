
const primitive = `
const { reactiveRoot, useState } = atomx(1);

const change = ()=> {
  reactiveRoot.val++; // commit at next tick
};

function Demo() {
  const [ numVal ] = useState(); // already unboxed
  const [ count, setCount ] = React.useState(0);

  helux.useWatch(()=>{
    console.log('found reactiveRoot changed');
    // no closure trap
    console.log('always print latest count ', count);
  }, ()=>[reactiveRoot]);

  return (
    <div>
      num: {numVal}
      <br />
      local count: {count}
      <button onClick={change}>change</button>
      <button onClick={()=>setCount(prev=>prev+1)}>change count</button>
    </div>
  );
};

render(<><Demo /><Demo /></>);
`;

const dict = `
// use unboxed reactive instead of boxed reactiveRoot here
const { reactive, useState } = atomx({ a: 1, b: { b1: { b2: 1 } } });

const change = ()=> {
  reactive.b.b1.b2++; // commit at next tick
};

function Demo() {
  const [ numVal ] = useState(); // already unboxed
  const [ count, setCount ] = React.useState(0);

  helux.useWatch(()=>{
    console.log('found reactive..b.b1.b2 changed');
    // no closure trap
    console.log('always print latest count ', count);
  }, ()=>[reactive.b.b1.b2]); // watch sub node

  return (
    <div>
      reactive.b.b1.b2: {reactive.b.b1.b2}
      <br />
      local count: {count}
      <button onClick={change}>change</button>
      <button onClick={()=>setCount(prev=>prev+1)}>change count</button>
    </div>
  );
};

render(<><Demo /><Demo /></>);
`;

export default {
  primitive,
  dict,
} as Record<string, string>;
