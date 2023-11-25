import * as React from 'react'

export function expectEqual(actualVal, expectVal) {
  expect(actualVal === expectVal).toBeTruthy();
}

export function expectNotEqual(actualVal, expectVal) {
  expect(actualVal === expectVal).toBeFalsy();
}

export function expectMatch(actualVal, expectVal) {
  expect(actualVal).toMatchObject(expectVal);
}

export function expectTruthy(actualVal) {
  expect(actualVal).toBeTruthy();
}

export function useForceUpdate() {
  const [, setState] = React.useState({});
  return () => setState({});
}

export function delay(ms = 1000) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * for getting pretty format multi line string when use \`...\`
 * this function will remove indent of every line automatically
 * @param {string} mayLineBreakStr
 * @param {'MULTI' | 'ONE'} [mode='MULTI']
 * @returns
 * ```
 * // usage 1, process multi lines with mode='MULTI' by default
 * pfstr(`
 *   line1 line1 line1,
 *   line2 line2 line2.
 * `);
 * // pass to console.log will print:
 * line1 line1 line1,
 * line2 line2 line2.
 * // attention: end <br/> will be removed automatically in MULTI mode
 * pfstr(`
 *   line1 line1 line1,<br/>
 *   line2 line2 line2.
 * `);
 * // pass to console.log will print:
 * line1 line1 line1,
 * line2 line2 line2.
 *
 * // usage 2, set mode='ONE' to get no line break string
 * pfstr(`
 *   line1 line1 line1,
 *   line2 line2 line2.
 * `, 'ONE');
 * // pass to console.log will print:
 * line1 line1 line1, line2 line2 line2.
 *
 * // usage 3, add <br/> to control line break
 * pfstr(`
 *   line1 line1 line1,
 *   line2 line2 line2,<br/>
 *   line3 line3 line3.
 * `, 'ONE');
 * // pass to console.log will print:
 * line1 line1 line1, line2 line2 line2,
 * line3 line3 line3.
 * ```
 */
export function pfstr(/** @type string */ mayLineBreakStr, mode = 'MULTI') {
  // MULTI ONE
  const lines = mayLineBreakStr.split('\n');
  const lastIdx = lines.length - 1;

  const formatLine = lines
    .map((line, idx) => {
      if (!line && (idx === 0 || idx === lastIdx)) {
        return '';
      }
      const replaceBr = (/** @type string */ line, hasBrStr, noBrStr = '') => {
        let result = line;
        if (line.endsWith('<br/>')) {
          result = line.substring(0, result.length - 5);
          return `${result}${hasBrStr}`;
        }
        return `${result}${noBrStr}`;
      };

      // 此处暂时规避可选链写法，因 rollup 对此未处理，编译后上层使用会报错
      // SyntaxError: Unexpected token '.'
      const { trimStart } = line;
      let result = trimStart ? line.trimStart() : line; // 去头部所有空格
      if (mode === 'MULTI') {
        return `${replaceBr(result, '')}\n`;
      }
      result = replaceBr(result, '\n', ' ');
      return result;
    })
    .join('');
  return formatLine;
}
