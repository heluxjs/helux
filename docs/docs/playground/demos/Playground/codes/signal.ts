const primitive = `
const [ num, setNum ] = atom(1);

const change = ()=> {
  setNum(prev=>prev+1);
  console.log(\`num is \${num.val}\`);
};

render(<button onClick={change}>change {signal(num)}</button>);
`;

const alias = `
const [ num, setNum ] = atom(1);

const change = ()=> {
  setNum(prev=>prev+1);
  console.log(\`num is \${num.val}\`);
};

// use $ instead of signal to wrap shared state primitive value
render(<button onClick={change}>change {$(num)}</button>);
`;

const format = `
const [ num, setNum ] = atom(1);

const change = ()=> {
  setNum(prev=>prev+1);
  console.log(\`num is \${num.val}\`);
};

render(<button onClick={change}>change {$(num, (val)=>\`this is num \${val}\`)}</button>);
`;

const block = `
const [ num, setNum ] = atom(1);

const change = ()=> {
  setNum(prev=>prev+1);
  console.log(\`num is \${num.val}\`);
};

const Num = block(()=>{
  const [ count, setCount ] = React.useState(0);

  return (
    <div>
      {/** pass shared state primite value without hook */}
      {num.val}
      <br />
      local count: {count}
      <button onClick={change}>change</button>
      <button onClick={()=>setCount(prev=>prev+1)}>change count</button>
    </div>
  );
});

render(<><Num /><Num /></>);
`;

export default {
  primitive,
  alias,
  format,
  block,
} as Record<string, string>;
