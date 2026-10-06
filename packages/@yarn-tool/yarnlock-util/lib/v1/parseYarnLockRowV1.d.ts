import { IYarnLockDataRowV1 } from '@yarn-tool/yarnlock-types';
import { IParseNameAndVersionWithNpaResult } from '../types';
/**
 * 解析 Yarn v1 的列鍵（Row Key），回傳統一的名稱／版本／範圍結構。
 * Parse a Yarn v1 row key into the shared name/version/range structure.
 *
 * @param packageName 列鍵，例如 `lodash@^4.17.0`、`@babel/core@^7.0.0` /
 *                    The row key, for example `lodash@^4.17.0`, `@babel/core@^7.0.0`
 * @param packageData 該列的資料，`version` 為實際解析到的版本 /
 *                     The row data; `version` is the resolved version
 * @returns 解析結果；名稱取不到時回傳 `undefined` / The parse result, or `undefined` when no
 *          name can be determined
 */
export declare function parseYarnLockRowV1(packageName: string, packageData: IYarnLockDataRowV1): IParseNameAndVersionWithNpaResult;
