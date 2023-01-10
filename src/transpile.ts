import { parseModule, parseScript } from 'esprima';
import { generator } from './generator';
import { transpile_options } from './types/transpile';
import { default_transpile_options } from './defaults/transpile_default';

/**
 * This file collates the parser returns the generated code.
 * @param code
 */
export const transpile = (
  code: string,
  options: transpile_options = default_transpile_options,
) => {
  options = { ...default_transpile_options, ...options };

  let ast =
    options.parse_type == 'script' ? parseScript(code) : parseModule(code);
  let out = generator(ast, {
    object_name: options.object_name,
    additional_callees: options.additional_callees,
  });

  return out;
};
