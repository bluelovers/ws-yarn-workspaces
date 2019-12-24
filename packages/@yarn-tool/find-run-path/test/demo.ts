
import { processRunPath } from '../index';
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
