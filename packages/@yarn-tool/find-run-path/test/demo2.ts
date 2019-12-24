
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
