/// <reference types="node" />
import { EnumDetectYarnLock } from '@yarn-tool/detect-yarnlock-version/lib/types';
export declare type IYarnLockParsed = IYarnLockParsedV1 | IYarnLockParsedV2;
export interface IYarnLockParsedV1<D extends Record<string, any> = Record<string, any>> {
    verType: EnumDetectYarnLock.v1;
    meta?: {
        type?: string;
    };
    data: D;
}
export interface IYarnLockParsedV2<D extends Record<string, any> = Record<string, any>> {
    verType: EnumDetectYarnLock.berry;
    meta?: {
        version?: string;
    };
    data: D;
}
export declare function yarnLockParse(yarnlock_old: Buffer | string): IYarnLockParsedV1 | IYarnLockParsedV2;
export declare function isYarnLockParsedV1<T extends Record<string, any>>(data: any): data is IYarnLockParsedV1<T>;
export declare function isYarnLockParsedV2<T extends Record<string, any>>(data: any): data is IYarnLockParsedV2<T>;
export default yarnLockParse;
