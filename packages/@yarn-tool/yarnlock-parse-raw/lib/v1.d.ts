/// <reference types="node" />
import { IYarnLockRawSourceV1, IYarnLockRawSourceV1Full } from '@yarn-tool/yarnlock-types';
declare module '@yarnpkg/lockfile' {
    function parse<T extends IYarnLockRawSourceV1Full = IYarnLockRawSourceV1Full>(source: string, fileLoc?: string): T;
    function parse(source: string, fileLoc?: string): IYarnLockRawSourceV1Full;
}
export declare function parseYarnLockRawV1<T extends IYarnLockRawSourceV1Full = IYarnLockRawSourceV1Full>(source: string | Buffer, fileLoc?: string): T;
export declare function getYarnLockRawV1Root(input: IYarnLockRawSourceV1): import("@yarn-tool/yarnlock-types").IYarnLockDataRecord<import("@yarn-tool/yarnlock-types").IYarnLockDataRowV1, string>;
export declare function parseYarnLockRawV1Root(source: string | Buffer, fileLoc?: string): import("@yarn-tool/yarnlock-types").IYarnLockDataRecord<import("@yarn-tool/yarnlock-types").IYarnLockDataRowV1, string>;
export declare function stringifyYarnLockRawV1(json: any, noHeader?: boolean): string;
