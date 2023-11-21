import Highlight, { defaultProps } from 'prism-react-renderer';
import theme from 'prism-react-renderer/themes/vsDark';
import { Line, LineContent, LineNo, Pre } from './styled';

const WithLineNumbers = (props) => (
  <div style={{ width: '1000px', minHeight: '500px', margin: '0 auto' }}>
    <Highlight {...defaultProps} theme={theme} code={props.value} language={props.lang || 'typescript'}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <Pre className={className} style={style}>
          {tokens.map((line, i) => (
            <Line key={i} {...getLineProps({ line, key: i })}>
              <LineNo>{i + 1}</LineNo>
              <LineContent>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token, key })} />
                ))}
              </LineContent>
            </Line>
          ))}
        </Pre>
      )}
    </Highlight>
  </div>
);

export default WithLineNumbers;
