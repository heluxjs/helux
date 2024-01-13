
const primitive = `
const [ num, setNum ] = atom(1);
const result = derive(()=> num.val + 100);

const change = ()=> {
  setNum(prev => prev + 1);
  console.log(\`num is \${num.val}\`);
};

function Demo() {
  const [ numVal ] = useDerived(result); // already unboxed
  return (
    <div>
      derived num: {numVal}
      <button onClick={change}>change</button>
    </div>
  );
};

render(<><h1>num: {$(num.val)}</h1><Demo /><Demo /></>);
`;

export default {
  primitive,
} as Record<string, string>;
