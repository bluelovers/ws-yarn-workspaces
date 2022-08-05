/// <reference types="node" />
import { IYarnLockParsed, IYarnLockSource } from '@yarn-tool/yarnlock-types';
export declare function yarnLockStringify(yarnlock_old: Record<string, any> | Buffer | string | IYarnLockSource | IYarnLockParsed): string;
export default yarnLockStringify;
