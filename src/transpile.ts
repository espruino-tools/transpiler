import { parseScript } from 'esprima';
import { generator } from './generator';

/**
 * This file collates the parser returns the generated code.
 * @param code
 */
export const transpile = (code: string) => {
  let ast = parseScript(code);
  let out = generator(ast);

  return out;
};
