/// <reference types="node" />
import { IYarnLockRawSourceV2 } from '@yarn-tool/yarnlock-types';
declare module '@yarnpkg/parsers' {
    function parseSyml<T extends IYarnLockRawSourceV2 = IYarnLockRawSourceV2>(source: string): T;
    function parseSyml(source: string): IYarnLockRawSourceV2;
}
export declare function parseYarnLockRawV2<T extends IYarnLockRawSourceV2 = IYarnLockRawSourceV2>(source: string | Buffer): T;
export declare function getYarnLockRawV2Root(input: IYarnLockRawSourceV2): IYarnLockRawSourceV2;
export { parseYarnLockRawV2 as parseYarnLockRawV2Root };
export declare function stringifyYarnLockRawV2(json: any, noHeader?: boolean): string;
