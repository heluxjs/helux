

const primitive = `
const [ num, setNum ] = atom(1);

const change = ()=> {
  setNum(prev=>prev+1);
  console.log(\`num is \${num.val}\`);
};

render(<button onClick={change}>change {$(num)}</button>);
`;

const dict = `
const [dict, setDict] = atom({ a: 1, b: { b1: { b2: 1 } } });

const change = () => {
  setDict(draft => {
    // draft was already unboxed from { val: T } to T
    draft.b.b1.b2 += 100;
  })
  console.log('dict.val.b.b1.b2 is ', dict.val.b.b1.b2);
};

render(<button onClick={ change } > change { $(dict.val.b.b1.b2)}</button>);
`;

const dict_atomx = `
// state was already unboxed from { val: T } to T
const { state, setDraft } = atomx({ a: 1, b: { b1: { b2: 1 } } });

const change = () => {
  setDraft(draft => draft.b.b1.b2 += 100);
  console.log('state.b.b1.b2 is ', state.b.b1.b2);
};

render(<button onClick={change}>change {$(state.b.b1.b2)}</button>);
`;


export default {
  primitive,
  dict,
  dict_atomx,
} as Record<string, string>;
