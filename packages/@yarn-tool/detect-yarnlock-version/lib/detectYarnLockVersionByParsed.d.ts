import { IYarnLockParsed, IYarnLockParsedLoose } from '@yarn-tool/yarnlock-types';
/**
 * 從 parser 的解析結果讀取格式版本。
 *
 * Reads the format version straight out of a parser result.
 *
 * @param parsedObject `@yarn-tool/yarnlock-parse-raw` 的解析結果 /
 * a parse result from @yarn-tool/yarnlock-parse-raw
 * @returns 解析結果具備標準結構時回傳其 `verType`，否則回傳 undefined /
 * the `verType` when the result has the expected shape, otherwise undefined
 */
export declare function detectYarnLockVersionByParsed(parsedObject: IYarnLockParsed | IYarnLockParsedLoose): import("@yarn-tool/yarnlock-types").EnumDetectYarnLock.v1 | import("@yarn-tool/yarnlock-types").EnumDetectYarnLock.v2 | import("@yarn-tool/yarnlock-types").EnumDetectYarnLock.v3;
