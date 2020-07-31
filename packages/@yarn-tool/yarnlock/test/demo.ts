import { join } from "path";
import { readYarnLockfile } from '../index';
import { readFileSync } from 'fs';
import { parseFull } from "../lib/v2/parse";

const __res = join(__dirname, 'res');

let data = readYarnLockfile(join(__res, 'yarn.lock'))

//console.dir(data)

let buf = readFileSync(join(__res, 'v2', 'yarn.lock'))

console.dir(parseFull(buf))

