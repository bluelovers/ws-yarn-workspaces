import { join } from "path";
import { readYarnLockFile } from '../index';
import { readFileSync } from 'fs';
import { parseFull } from "../lib/v2/parse";
import { __TEST_YARNLOCK } from '../../../../__root_ws';

const __res = __TEST_YARNLOCK;

let data = readYarnLockFile(join(__res, 'v1', 'yarn.lock'))

//console.dir(data)

let buf = readFileSync(join(__res, 'v3', 'yarn.lock'))

console.dir(parseFull(buf))
