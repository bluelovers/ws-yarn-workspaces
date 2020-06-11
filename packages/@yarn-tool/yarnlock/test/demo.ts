import { join } from "path";
import { readYarnLockfile } from '..';

const __res = join(__dirname, 'res');

let data = readYarnLockfile(join(__res, 'yarn.lock'))

console.dir(data)
