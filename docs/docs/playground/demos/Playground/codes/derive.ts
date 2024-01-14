
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

const dict = `
const [ num, setNum ] = atom(1);
// deriveDict has no boxed behavior
const result = deriveDict(()=> ({ plus1: num.val + 1, plus100: num.val + 100 }));

const change = ()=> {
  setNum(prev=>prev+1);
  console.log(\`num is \${num.val}\`);
  console.log('result is', result);
};

render(<button onClick={change}>change {$(result.plus1)} {$(result.plus100)}</button>);
`;

export default {
  primitive,
  dict,
} as Record<string, string>;
