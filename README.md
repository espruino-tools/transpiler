# @espruino-tools/transpiler

A micro-compiler utilising `esprima` and `escodegen` to convert espruino tools syntax into espruino native code. This package was built for usage in the `@espruino-tools/core` package and the online espruino tools IDE.

### Installing the package

#### CDN

To use the package in a standard HTML file simply import the script with the following tags

```html
<script src="https://unpkg.com/@espruino-tools/transpiler@latest/min/main.min.js"></script>
```

#### NPM

To use the package in a node project simply run the npm command:

```bash
npm i @espruino-tools/transpiler
```

### Using the package

using the package is simple:

```javascript
import { transpile } from '@espruino-tools/transpiler';

let code = `import { Puck } from '@espruino-tools/core
let p = new Puck();

p.LED.on('red')
`;

console.log(transpile(code));
```

```javascript
> LED2.set();
```

or through the script tags like so:

```html
<script src="https://unpkg.com/@espruino-tools/transpiler@latest/min/main.min.js"></script>

<script>

  let code = `import { Puck } from '@espruino-tools/core
  let p = new Puck();

  p.LED.on('red')
  `

  console.log(ESPT_Transpiler.transpile(code)))
</script>
```
