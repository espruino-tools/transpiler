import * as esprima from 'esprima';
import { transformer } from '../transformer';

describe('Can transform AST with desired syntax', () => {
  it('Should take in an AST and return an AST with converted syntax', () => {
    let code_before = `import { Puck } from '@espruino-tools/core';
  let p = new Puck();
  p.LED.on('red');`;
    let ast_before = esprima.parseModule(code_before);

    let code_after = `LED1.set();`;

    let ast_after = esprima.parseModule(code_after);

    expect(
      transformer(ast_before, {
        additional_callees: [],
      }).body,
    ).toStrictEqual(ast_after.body);
  });
});
