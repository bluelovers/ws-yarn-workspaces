/// <reference types="node" />
import { stringify } from '@yarnpkg/lockfile';
import { IYarnLockRawSourceV1Full } from '@yarn-tool/yarnlock-types';
declare module '@yarnpkg/lockfile' {
    function parse<T extends IYarnLockRawSourceV1Full = IYarnLockRawSourceV1Full>(source: string, fileLoc?: string): T;
    function parse(source: string, fileLoc?: string): IYarnLockRawSourceV1Full;
}
export declare function parseYarnLockRawV1<T extends IYarnLockRawSourceV1Full = IYarnLockRawSourceV1Full>(source: string | Buffer, fileLoc?: string): T;
export declare function parseYarnLockRawV1Root(source: string | Buffer, fileLoc?: string): import("@yarn-tool/yarnlock-types").IYarnLockDataRecord<import("@yarn-tool/yarnlock-types").IYarnLockDataRowV1>;
export { stringify as stringifyYarnLockRawV1 };
