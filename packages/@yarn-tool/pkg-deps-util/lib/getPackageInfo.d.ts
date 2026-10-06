/**
 * 查詢 npm registry 的套件資訊 (Query package info from the npm registry)
 *
 * 封裝版本查詢流程並加上降級處理，讓安裝檢查在 registry 異常時仍能取得結果。
 *
 * Wraps the version query with graceful fallbacks so install checks still get
 * an answer when the registry misbehaves.
 */
import { IParsePackageName } from '@yarn-tool/npm-package-arg-util/lib/types';
import { AbbreviatedVersion } from 'package-json';
/**
 * 查詢套件資訊 (Query package info)
 *
 * Query package info from the npm registry.
 *
 * @param packageName 套件名稱字串，或已解析過的套件名稱物件
 *                   A name string, or an already parsed package name object
 * @param excludeVersion 是否忽略輸入的版本，一律查詢 `latest`
 *                       Ignore the input version and always query `latest`
 *
 * @returns 套件的簡要版本資訊；套件不存在時回傳 `undefined`
 *
 * Abbreviated version info, or `undefined` when the package does not exist.
 */
export declare function getPackageInfo(packageName: string | IParsePackageName, excludeVersion?: boolean): import("bluebird")<AbbreviatedVersion>;
