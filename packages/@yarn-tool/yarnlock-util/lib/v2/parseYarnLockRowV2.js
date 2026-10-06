"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseYarnLockRowV2 = parseYarnLockRowV2;
const yarn_struct_utils_1 = require("@yarn-tool/yarn-struct-utils");
const npm_package_arg_util_1 = require("@yarn-tool/npm-package-arg-util");
const getSemverFromNpaResult_1 = require("@yarn-tool/npm-package-arg-util/lib/getSemverFromNpaResult");
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
function parseYarnLockRowV2(packageName, packageData) {
    var _a;
    let ret = (0, yarn_struct_utils_1.parseResolutionOrDescriptor)(packageData.resolution);
    /**
     * `fullName` 才包含 scope（例如 `@babel/core`）；
     * 用錯欄位會把 scoped 套件拆成錯誤名稱，因此一律取 `fullName`。
     * `fullName` is the one that includes the scope (for example `@babel/core`); reading any
     * other field would split scoped packages into a wrong name, so `fullName` is always used.
     */
    let name = ret === null || ret === void 0 ? void 0 : ret.fullName;
    /**
     * 整個回傳包在 `if (name)` 內：`resolution` 缺失或格式異常時
     * 直接回傳 `undefined`，讓呼叫端略過該列而不是拿到半成品資料。
     * The whole return sits inside `if (name)`: when `resolution` is missing or malformed the
     * function returns `undefined` so callers can skip the row instead of receiving half-built
     * data.
     */
    if (name) {
        /**
         * @todo support check patch
         *
         * 目前只取 `description`（描述子中的版本／範圍）並退回 `packageData.version`，
         * 尚未驗證 patch 相依（Patch Dependency，如 `patch:` 修補）的影響。
         * Currently only `description` (the version/range inside the descriptor) is used, with a
         * fallback to `packageData.version`; the effect of patch dependencies (`patch:`) is not
         * verified yet.
         */
        let version = (_a = ret.description) !== null && _a !== void 0 ? _a : packageData.version;
        /**
         * 去除 `npm:` 前綴：Berry 的描述子會寫成 `npm:4.17.21`，
         * 保留前綴會讓後續 semver 比對全部失敗。
         * The `npm:` prefix is stripped: Berry descriptors look like `npm:4.17.21`, and keeping
         * the prefix would make every later semver comparison fail.
         */
        version = version.replace(/^(npm):/, '');
        /**
         * 前綴去除後可能變成空字串（例如 `resolution` 只有 `npm:`），
         * 此時退回原始的 `description`，避免產生無法比對的空版本。
         * After stripping, the string may become empty (for example when `resolution` is only
         * `npm:`); the raw `description` is then used so the version never ends up empty and
         * uncomparable.
         */
        if (!version.length) {
            version = ret.description;
        }
        /**
         * @fixme support packageName: 'once@npm:^1.3.1, once@npm:^1.4.0'
         *
         * npa 尚無法解析「同一列鍵含多個描述子」的情況，此時 `parsed` 會是
         * `undefined`，回傳值的 `type` / `raw` / `semver` 皆為空，但名稱與版本仍可用。
         * npa cannot yet parse a row key holding several descriptors; in that case `parsed` is
         * `undefined` and the returned `type` / `raw` / `semver` are empty, while the name and
         * version remain usable.
         */
        let parsed = (0, npm_package_arg_util_1.npaTry)(packageName);
        let semver;
        /**
         * 只有 npa 成功時才取範圍，失敗時保持 `undefined`：
         * 這比填入猜測值安全，下游可據此判斷「沒有可信的範圍」。
         * The range is only taken when npa succeeds and stays `undefined` otherwise: that is safer
         * than a guessed value, and downstream code can detect "no trustworthy range".
         */
        if (parsed) {
            semver = (0, getSemverFromNpaResult_1.getSemverFromNpaResult)(parsed);
        }
        return {
            name,
            version,
            type: parsed === null || parsed === void 0 ? void 0 : parsed.type,
            raw: parsed === null || parsed === void 0 ? void 0 : parsed.raw,
            semver,
        };
    }
}
//# sourceMappingURL=parseYarnLockRowV2.js.map