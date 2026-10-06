import { IYarnLockDataRowV2 } from '@yarn-tool/yarnlock-types';
import { IParseNameAndVersionWithNpaResult } from '../types';
/**
 * 解析 Berry（v2/v3）的列，回傳統一的名稱／版本／範圍結構。
 * Parse a Berry (v2/v3) row into the shared name/version/range structure.
 *
 * 與 v1 的關鍵差異：Berry 把名稱放在 `resolution` 欄位，
 * 列鍵只是描述子（Descriptor），因此必須先解析 `resolution` 才拿得到 `name`。
 * The key difference from v1: Berry stores the name in the `resolution` field and the row key is
 * only a descriptor, so `resolution` must be parsed first to obtain `name`.
 *
 * @param packageName 列鍵（描述子），例如 `lodash@npm:^4.17.21` /
 *                    The row key (descriptor), for example `lodash@npm:^4.17.21`
 * @param packageData 該列的資料 / The row data
 * @returns 解析結果；名稱取不到時回傳 `undefined` / The parse result, or `undefined` when no
 *          name can be determined
 */
export declare function parseYarnLockRowV2(packageName: string, packageData: IYarnLockDataRowV2): IParseNameAndVersionWithNpaResult;
