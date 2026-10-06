/**
 * Check and update resolutions in yarn.lock.
 * 檢查並更新 yarn.lock 中的 resolutions 版本。
 *
 * 此模組提供功能：
 * - 解析 yarn.lock 檔案（支援 v1 和 v2 格式）
 * - 檢查 resolutions 中套件的可用更新
 * - 更新 yarn.lock 中的版本資訊
 *
 * @module update/checkResolutionsUpdate
 */
import { IPackageMap, IOptionsNpmCheckUpdates, IVersionCacheMapValue } from '../types';
import { EnumDetectYarnLock, IYarnLockSource } from '@yarn-tool/yarnlock-types';
import { ITSExcludeEnumValue } from 'ts-type/lib/helper/record/enum';
/**
 * 檢查並更新 yarn.lock 中的 resolutions (Check and update resolutions in yarn.lock)
 *
 * 作法：先解析 yarn.lock（自動偵測 v1 / v2 格式），取出「每個套件當初被安裝的版本」，
 * 再向遠端查詢可更新的版本，最後依結果改寫 lock 資料：
 * - 已安裝版本低於可更新版本 → 刪除該套件的舊條目，讓它重新解析
 * - 同一套件安裝了多個版本 → 統一為單一版本（去重 dedupe）
 *
 * It parses the yarn.lock (auto-detecting v1 / v2), collects the versions each
 * package was installed at, queries updatable versions remotely, then rewrites the
 * lock data:
 * - installed version older than the resolved one → drop the package's old entries
 *   so it gets re-resolved
 * - several versions installed for one package → collapse them into one (dedupe)
 *
 * 邊界情況：輸入可為字串 / Buffer / 已解析物件；只有字串與 Buffer 需要先做格式
 * 偵測 (format detection)，物件輸入會沿用呼叫端傳入的 `verType`。
 * Edge case: the input may be a string / Buffer / an already parsed object; only
 * the first two need format detection, an object input keeps the caller's `verType`.
 *
 * @param resolutions - resolutions 的套件對應表 / The resolutions package map
 * @param yarnlock_old_obj - yarn.lock 內容或已解析物件 / yarn.lock content or an already parsed object
 * @param options - ncu 選項 / ncu options
 * @returns 新的 yarn.lock 物件、變更清單與查詢結果 / New yarn.lock object, change list and query results
 */
export declare function checkResolutionsUpdate<T extends IYarnLockSource>(resolutions: IPackageMap, yarnlock_old_obj: IYarnLockSource | Buffer | string, options: Partial<IOptionsNpmCheckUpdates>): import("bluebird")<{
    verType: ITSExcludeEnumValue<typeof EnumDetectYarnLock, 0>;
    yarnlock_old_obj: T;
    yarnlock_new_obj: T;
    update_list: string[];
    yarnlock_changed: boolean;
    deps: IVersionCacheMapValue[];
    deps2: IPackageMap;
    deps3: Record<string, IVersionCacheMapValue>;
}>;
