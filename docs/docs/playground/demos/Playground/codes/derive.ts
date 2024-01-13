
// render(<button onClick={change}>change</button>);

// const changeBtnStr = `render(<button onClick={change}>change</button>);`

const primitive = `
const [ num, setNum ] = atom(1);
const result = derive(()=> num.val + 1);

const change = ()=> {
  setNum(prev=>prev+1);
  console.log(\`num is \${num.val}\`);
  console.log(\`result is \${result.val}\`);
};

render(<button onClick={change}>change {$(result.val)}</button>);
`;

export default {
  primitive,
} as Record<string, string>;
