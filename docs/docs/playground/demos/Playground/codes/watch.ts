



const primitive = `
const [num, setNum] = atom(1);
watch(
  // watch cb
  () => {
    console.log(\`change from \${getSnap(num).val} to \${num.val}\`);
  },
  // deps cb
  () => [num],
);

const change = () => {
  setNum(prev => prev + 1);
  console.log(\`num is \${num.val}\`);
};

render(<button onClick={change}>change {$(num)}</button>);
`;

const dict = `
const [dict, setDict] = atom({ a: 1, b: { b1: { b2: 1 } } });
watch(
  // watch cb
  () => {
    console.log(\`change from \${getSnap(dict).val.b.b1.b2} to \${dict.val.b.b1.b2}\`);
  },
  // deps cb
  () => [dict.val.b.b1.b2],
);

const change = () => {
  setDict(draft => {
    // draft was already unboxed from { val: T } to T
    draft.b.b1.b2 += 100;
  });
  console.log('dict.val.b.b1.b2 is ', dict.val.b.b1.b2);
};

render(<button onClick={change}>change {$(dict.val.b.b1.b2)}</button>);

`;

export default {
  primitive,
  dict,
} as Record<string, string>;
