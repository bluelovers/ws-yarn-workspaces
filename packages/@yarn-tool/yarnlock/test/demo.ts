import { join } from "path";
import { readFileSync } from 'fs';
import { __TEST_YARNLOCK } from '../../../../__root_ws';
import { parseYarnLockRawV2 } from '@yarn-tool/yarnlock-parse-raw';

const __res = __TEST_YARNLOCK;

//let data = readYarnLockFile(join(__res, 'v1', 'yarn.lock'))
//
////console.dir(data)
//
//let buf = readFileSync(join(__res, 'v3', 'yarn.lock'))
//
//console.dir(parseYarnLockRawV2(buf))
