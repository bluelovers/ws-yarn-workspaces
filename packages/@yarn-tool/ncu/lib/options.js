"use strict";
/**
 * Created by user on 2020/6/12.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.npmCheckUpdatesOptions = npmCheckUpdatesOptions;
/**
 * 建立傳給 `npm-check-updates` 的選項副本
 * 一定會回傳新物件（呼叫端的選項不會被改動），並做以下處理：
 * - 刪除 `upgrade` / `global`：更新結果由 {@link npmCheckUpdates} 自行比對與寫入，
 *   交給 ncu 自動升級會繞過本套件的快取與表格輸出
 * - 強制 `packageManager = 'npm'`：yarn 的版本解析交由 yarn.lock 相關流程負責
 * - 將 `json_old` 序列化成 `packageData`：ncu 只接受字串形式的 package.json 內容
 * - 設定 `jsonUpdated`（`jsonUpgraded`）：要求 ncu 回傳更新後的 JSON 而非直接寫檔
 *
 * Always returns a new object (the caller's options are left untouched) and:
 * - deletes `upgrade` / `global`, because {@link npmCheckUpdates} does the diff and
 *   writing itself; letting ncu upgrade would bypass this package's cache and table
 * - forces `packageManager = 'npm'`, since yarn resolution is handled by the
 *   yarn.lock flow instead
 * - serialises `json_old` into `packageData`, because ncu only accepts the
 *   package.json content as a string
 * - sets `jsonUpgraded`, asking ncu to return the upgraded JSON rather than write files
 *
 * @param ncuOptions - 原始選項 / Original options
 * @returns 正規化後、可安全傳給 `run()` 的選項 / Normalised options safe for `run()`
 */
function npmCheckUpdatesOptions(ncuOptions) {
    ncuOptions = {
        ...ncuOptions,
    };
    delete ncuOptions.upgrade;
    // @ts-ignore
    delete ncuOptions.global;
    ncuOptions.packageManager = 'npm';
    /**
     * 若同時提供 packageData 則以 json_old 為準，避免兩者不一致時產生錯誤的更新結果
     * When both are given, json_old wins so a stale packageData cannot cause a wrong diff
     */
    if (ncuOptions.json_old) {
        ncuOptions.packageData = JSON.stringify(ncuOptions.json_old);
    }
    // @ts-ignore
    ncuOptions.jsonUpgraded = true;
    return ncuOptions;
}
//# sourceMappingURL=options.js.map