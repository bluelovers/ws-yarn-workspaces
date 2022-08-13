/// <reference types="node" />
import { EnumDetectYarnLock, IYarnLockParsed, IYarnLockRawSourceV1, IYarnLockRawSourceV2, IYarnLockSource } from '@yarn-tool/yarnlock-types';
import { stringifyYarnLockRawV1 } from '@yarn-tool/yarnlock-parse-raw/lib/v1';
import { stringifyYarnLockRawV2 } from '@yarn-tool/yarnlock-parse-raw/lib/v2';
export declare function yarnLockStringify(yarnlock_old: Record<string, any> | Buffer | string | IYarnLockSource | IYarnLockParsed): string;
export type IResultYarnLockStringifyRaw = {
    verType: EnumDetectYarnLock.v1;
    fn: typeof stringifyYarnLockRawV1;
    json: IYarnLockRawSourceV1;
    content: string;
} | {
    verType: EnumDetectYarnLock.v2;
    fn: typeof stringifyYarnLockRawV2;
    json: IYarnLockRawSourceV2;
    content: string;
} | {
    verType: EnumDetectYarnLock.v3;
    fn: typeof stringifyYarnLockRawV2;
    json: IYarnLockRawSourceV2;
    content: string;
};
export declare function _yarnLockStringifyRaw(yarnlockRawJSON: IYarnLockSource): IResultYarnLockStringifyRaw;
export declare function yarnLockStringifyRaw(yarnlockRawJSON: IYarnLockSource): string;
export declare function _yarnLockStringifyRawCore(verType: EnumDetectYarnLock, yarnlockRawJSON: IYarnLockSource): IResultYarnLockStringifyRaw;
export default yarnLockStringify;
