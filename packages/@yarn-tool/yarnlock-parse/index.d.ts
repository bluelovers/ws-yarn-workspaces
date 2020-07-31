/// <reference types="node" />
import { EnumDetectYarnLock } from '@yarn-tool/detect-yarnlock-version/lib/types';
export interface IYarnLockParseV1<D extends Record<string, any> = Record<string, any>> {
    verType: EnumDetectYarnLock.v1;
    meta?: {
        type?: string;
    };
    data: D;
}
export interface IYarnLockParseV2<D extends Record<string, any> = Record<string, any>> {
    verType: EnumDetectYarnLock.berry;
    meta?: {
        version?: string;
    };
    data: D;
}
export declare function yarnLockParse(yarnlock_old: Record<string, any> | Buffer | string): IYarnLockParseV1 | IYarnLockParseV2;
export declare function isYarnLockParseV1<T extends Record<string, any>>(data: any): data is IYarnLockParseV1<T>;
export declare function isYarnLockParseV2<T extends Record<string, any>>(data: any): data is IYarnLockParseV2<T>;
export default yarnLockParse;
