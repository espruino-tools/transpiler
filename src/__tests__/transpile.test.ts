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

    let expected_code = `setWatch(function () {
    LED1.set();
}, BTN, {
    edge: 'rising',
    repeat: true,
    debounce: 50
});`;

    expect(transpile(code)).toBe(expected_code);
  });
});

describe('conditional statements', () => {
  it('should correctly format if statement', () => {
    let code = `import { Puck } from '@espruino-tools/core';
    let p = new Puck();
    if(x){
        p.LED.on('red');
    }`;

    let expected_code = `if (x) {
            LED1.set();
        }`;

    expect(transpile(code).replace(/\s/g, '')).toBe(
      expected_code.replace(/\s/g, ''),
    );
  });

  it('should correctly format switch statement', () => {
    let code = `import { Puck } from '@espruino-tools/core';
    let p = new Puck();
    switch(x){
      case 1: p.LED.on('red');
      case 2: p.LED.on('red');
    }`;

    let expected_code = `switch(x){
      case 1: LED1.set();
      case 2: LED1.set();
    }`;

    expect(transpile(code).replace(/\s/g, '')).toBe(
      expected_code.replace(/\s/g, ''),
    );
  });

  it('should correctly format ternary statement', () => {
    let code = `import { Puck } from '@espruino-tools/core';
    let p = new Puck();
    
    let x = true;

    x ? p.LED.on('red') : p.LED.on('green')

    `;

    let expected_code = `let x = true;
    x ? LED1.set(); : LED2.set();`;

    expect(transpile(code).replace(/\s/g, '')).toBe(
      expected_code.replace(/\s/g, ''),
    );
  });
});

describe('function initialising', () => {
  it('should correctly format function declaration', () => {
    let code = `import { Puck } from '@espruino-tools/core';
    let p = new Puck();
    function x(){
        p.LED.on('red');
    }`;

    let expected_code = `function x(){
            LED1.set();
        }`;

    expect(transpile(code).replace(/\s/g, '')).toBe(
      expected_code.replace(/\s/g, ''),
    );
  });

  it('should correctly format anonymous arrow declaration', () => {
    let code = `import { Puck } from '@espruino-tools/core';
    let p = new Puck();
    const x = () => {
        p.LED.on('red');
    }`;

    let expected_code = `const x = () => {
            LED1.set();
        };`;

    expect(transpile(code).replace(/\s/g, '')).toBe(
      expected_code.replace(/\s/g, ''),
    );
  });

  it('should correctly format anonymous arrow return declaration', () => {
    let code = `import { Puck } from '@espruino-tools/core';
    let p = new Puck();
    const x = () => 
        p.LED.on('red');
    `;

    let expected_code = `const x = () => 
            LED1.set();
        `;

    expect(transpile(code).replace(/\s/g, '')).toBe(
      expected_code.replace(/\s/g, ''),
    );
  });

  it('should correctly format anonymous function declaration', () => {
    let code = `import { Puck } from '@espruino-tools/core';
    let p = new Puck();
    const x = function(){
        p.LED.on('red');
    }`;

    let expected_code = `const x = function(){
            LED1.set();
        };`;

    expect(transpile(code).replace(/\s/g, '')).toBe(
      expected_code.replace(/\s/g, ''),
    );
  });
});

describe('variable init', () => {
  it('should work with objects', () => {
    let code = `import { Puck } from '@espruino-tools/core';
    let p = new Puck();
    let x ={
        f: p.LED.on('red')
    }`;

    let expected_code = `let x = {
            f: LED1.set();
        };`;

    expect(transpile(code).replace(/\s/g, '')).toBe(
      expected_code.replace(/\s/g, ''),
    );
  });
});

describe('', () => {
  it('', () => {
    expect(transpile('')).toBe('');
  });
});

describe('loops', () => {
  it('for', () => {
    let code = `import { Puck } from '@espruino-tools/core';
    let p = new Puck();
    for(let x = 0; x>10; x++){
        p.LED.on('red')
    }`;

    let expected_code = `for(let x = 0; x>10; x++){
      LED1.set();
    }`;

    expect(transpile(code).replace(/\s/g, '')).toBe(
      expected_code.replace(/\s/g, ''),
    );
  });
  it('while', () => {
    let code = `import { Puck } from '@espruino-tools/core';
    let p = new Puck();
    while(x>10){
        p.LED.on('red')
    }`;

    let expected_code = `while(x>10){
      LED1.set();
    }`;

    expect(transpile(code).replace(/\s/g, '')).toBe(
      expected_code.replace(/\s/g, ''),
    );
  });

  it('do while', () => {
    let code = `import { Puck } from '@espruino-tools/core';
    let p = new Puck();
    do{
        p.LED.on('red')
    }while(x>10)`;

    let expected_code = `do {
      LED1.set();
    }while(x>10);`;

    expect(transpile(code).replace(/\s/g, '')).toBe(
      expected_code.replace(/\s/g, ''),
    );
  });
});

describe('class', () => {
  it('methods should translate', () => {
    let code = `import { Puck } from '@espruino-tools/core';
    let p = new Puck();
    class NewClass{
      x(){
        p.LED.on('red')
      }
    }`;

    let expected_code = `class NewClass{
      x(){
        LED1.set();
      }
    }`;

    expect(transpile(code).replace(/\s/g, '')).toBe(
      expected_code.replace(/\s/g, ''),
    );
  });
});
