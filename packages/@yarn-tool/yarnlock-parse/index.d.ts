import { EnumDetectYarnLock, IYarnLockParsedV1, IYarnLockParsedV2, IYarnLockRawSourceV1, IYarnLockRawSourceV2, IYarnLockSource } from '@yarn-tool/yarnlock-types';
export declare function _yarnLockParseRawCore<T extends IYarnLockSource = IYarnLockSource>(verType: EnumDetectYarnLock, yarnlock_old: Buffer | string): {
    verType: EnumDetectYarnLock.v1 | EnumDetectYarnLock.v2 | EnumDetectYarnLock.v3;
    parsed: T;
    source: string;
};
export declare function _yarnLockParseRaw<T extends IYarnLockSource = IYarnLockSource>(yarnlock_old: Buffer | string): {
    verType: EnumDetectYarnLock.v1 | EnumDetectYarnLock.v2 | EnumDetectYarnLock.v3;
    parsed: T;
    source: string;
};
export declare function yarnLockParseRaw<T extends IYarnLockSource = IYarnLockSource>(yarnlock_old: Buffer | string): T;
export declare function yarnLockRawV1ToParsed(rawParsed: IYarnLockRawSourceV1): Omit<IYarnLockParsedV1, 'verType'>;
export declare function yarnLockRawV2ToParsed(rawParsed: IYarnLockRawSourceV2): Omit<IYarnLockParsedV2, 'verType'>;
export declare function _yarnLockParseCore<T extends IYarnLockParsedV1 | IYarnLockParsedV2 = IYarnLockParsedV1 | IYarnLockParsedV2>(inputResult: Pick<ReturnType<typeof _yarnLockParseRawCore>, 'verType' | 'parsed'>): T;
export declare function yarnLockParse<T extends IYarnLockParsedV1 | IYarnLockParsedV2 = IYarnLockParsedV1 | IYarnLockParsedV2>(yarnlock_old: Buffer | string): T;
export default yarnLockParse;
