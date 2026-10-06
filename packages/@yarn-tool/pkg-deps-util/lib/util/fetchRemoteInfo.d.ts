/**
 * 批次查詢遠端套件版本 (Batch query of remote package versions)
 *
 * 把使用者輸入的套件字串拆成名稱與版本條件，再向 registry 查詢實際可用版本，
 * 供後續與 yarn.lock 的條目比對。
 *
 * Splits each user input into name and version criteria, queries the registry
 * for the usable version, and feeds the result into the yarn.lock comparison.
 */
import Bluebird from 'bluebird';
import { IParsePackageName } from '@yarn-tool/npm-package-arg-util/lib/types';
import { IOptionsInstallDepsFromYarnLock } from '../types';
/**
 * 查詢多個套件的遠端版本資訊 (Query remote version info for multiple packages)
 *
 * Query remote version info for a list of packages.
 *
 * @param packageNames 套件名稱或查詢字串的清單 (List of names or specifiers)
 * @param options 查詢選項，含 `queryOptions` 與 lock 分組設定
 *                Query options, including `queryOptions` and lock grouping settings
 *
 * @returns 以套件名稱為鍵的查詢結果，值含解析資料與 `versionQuery`
 *
 * A record keyed by package name; each value holds the parsed data and the
 * resolved `versionQuery`.
 */
export declare function fetchRemoteInfo<T extends string>(packageNames: T[], options?: IOptionsInstallDepsFromYarnLock): Bluebird<Record<string, IParsePackageName & {
    versionQuery: string;
}> & Record<T, IParsePackageName & {
    versionQuery: string;
}>>;
