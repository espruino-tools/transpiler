import * as esprima from 'esprima';
import { generator } from '../generator';

describe('Can convert AST to code', () => {
  it('Should take in an AST and return a string of code', () => {
    let code = `import { Puck } from '@espruino-tools/core';
let p = new Puck();
p.LED.on('red');`;

    let ast = esprima.parseModule(code);

    expect(
      generator(ast, {
        additional_callees: [],
      }),
    ).toBe(code);
  });
});
