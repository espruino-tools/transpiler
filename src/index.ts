/**
 * This package provides both a cli and an exported function to
 * allow for transpiling within a file or across a directory.
 */
import { transpile } from './transpile';
import { generator } from './generator';
import { transformer } from './transformer';

let code = `import { Puck } from '@espruino-tools/core';
let p = new Puck();
let x = 1;
p.onPress(function(){

    if(x == 1){
        x = false;
        p.LED.on('green')
    } else if(x == 2){
        p.LED.on('blue')
    } else {
        p.LED.off('blue');
    }

    p.LED.on('red')
});`;

console.log(transpile(code));

export { transpile, generator, transformer };
