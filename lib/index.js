"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const esprima = require("esprima");
let program = `let puck = new Puck();

puck.LED.on("red");`;
let parsed = esprima.parseScript(program);
console.log(parsed.body[0].type);
