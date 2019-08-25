import ccContext from '../cc-context';

export function strictWarning(err) {
  if (ccContext.isStrict) {
    throw err;
  }
  console.error(' ------------ CC WARNING ------------');
  console.error(err);
}