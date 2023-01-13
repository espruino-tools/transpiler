import { transformer } from './transformer';
import { generator_options } from './types/generator';
import * as esprima from 'esprima';
import * as escodegen from 'escodegen';
/**
 * This will generate code from the AST
 * @param ast
 */

export const generator = (ast: any, options: generator_options) => {
  let code = ast.body.map((expr: any) => escodegen.generate(expr)).join('\n');

  return code;
};
