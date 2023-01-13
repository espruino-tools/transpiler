import { transpile } from '../transpile';

describe('Can turn espruino tools code into espruino native code', () => {
  it('Should convert et code to espruino native code', () => {
    let code = `import { Puck } from '@espruino-tools/core';
let p = new Puck();
p.LED.on('red');`;
    let expected_code = `LED1.set();`;

    expect(transpile(code)).toBe(expected_code);
  });

  it('Should work with functions as parameters', () => {
    let code = `import { Puck } from '@espruino-tools/core';
let p = new Puck();
p.onPress(function(){
    p.LED.on('red');
});`;

    let expected_code = `setWatch(function(){
    LED1.set();
})`;

    expect(transpile(code)).toBe(expected_code);
  });
});
