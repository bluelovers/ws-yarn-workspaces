# README.md

    add locally installed binaries paths into process.env

## install

```
yarn add env-run-path
```

## lazy use

```
import 'env-run-path/loader';
```

```
node -r env-run-path/loader -e console.log(process.env.Path)
```


## other use

demo1
```typescript

import { processRunPath } from 'env-run-path';
import { console } from 'debug-color2';

let { result, delimiter, pathKey } = processRunPath();

const originEnvPath = process.env[pathKey];

console.green.log(`origin:`);
console.log(originEnvPath);

console.green.log(`local`);
console.log(result);

// use origin first
process.env[pathKey] = [originEnvPath, result].join(delimiter);

console.green.log(`use origin first`);
console.log(process.env[pathKey]);

// use local bin first
process.env[pathKey] = [result, originEnvPath].join(delimiter);

console.green.log(`use local first`);
console.log(process.env[pathKey]);

```

demo2
```ts
import { processRunPath } from '../index';
import { console } from 'debug-color2';

let { result, pathKey } = processRunPath();

const originEnvPath = process.env[pathKey];

console.green.log(`origin:`);
console.log(originEnvPath);

// use origin first
result = processRunPath({
	includeEnvPath: true,
}).result;

console.green.log(`use origin first`);
console.log(result);

// use local bin first
result = processRunPath({
	includeEnvPath: true,
	prepend: true,
}).result;

console.green.log(`use local first`);
console.log(result);
```
