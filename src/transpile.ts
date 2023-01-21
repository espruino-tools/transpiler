import { parseModule, parseScript } from 'esprima';
import { generator } from './generator';
import { transpile_options } from './types/transpile';
import { default_transpile_options } from './defaults/transpile_default';
import { transformer } from './transformer';

/**
 * This file collates the parser returns the generated code.
 * @param code
 */
export const transpile = (
  code: string,
  options: transpile_options = default_transpile_options,
) => {
  options = { ...default_transpile_options, ...options };
  try {
    let ast =
      options.parse_type == 'script' ? parseScript(code) : parseModule(code);
    let transformed_ast = transformer(ast, options);
    let out = generator(transformed_ast, {
      object_name: options.object_name,
      additional_callees: options.additional_callees,
    });
    return out;
  } catch (err) {
    throw code;
  }
};
