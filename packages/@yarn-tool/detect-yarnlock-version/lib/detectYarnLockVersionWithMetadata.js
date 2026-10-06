"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectYarnLockVersionWithMetadata = detectYarnLockVersionWithMetadata;
exports._detectYarnLockVersionWithMetadataCore = _detectYarnLockVersionWithMetadataCore;
const util_1 = require("./util");
const yarnlock_types_1 = require("@yarn-tool/yarnlock-types");
/**
 * 只根據 `__metadata.version` 判斷 Berry lockfile 的格式版本。
 *
 * Determines the Berry lockfile format version from `__metadata.version`
 * alone.
 *
 * @param yarnLockObject 已解析的 lockfile 物件 / a parsed lockfile object
 * @returns 對應的版本列舉；沒有中繼資料或無法歸類時為 undefined /
 * the matching version enum, or undefined when metadata is absent or cannot
 * be classified
 */
function detectYarnLockVersionWithMetadata(yarnLockObject) {
    const metaVersion = (0, util_1.getMetadataVersion)(yarnLockObject);
    return _detectYarnLockVersionWithMetadataCore(metaVersion);
}
/**
 * 將 Berry 的中繼資料版本字串映射為 `EnumDetectYarnLock`。
 *
 * Maps a Berry metadata version string to `EnumDetectYarnLock`.
 *
 * @param metaVersion `__metadata.version` 字串或 undefined /
 * the `__metadata.version` string, or undefined
 * @returns `4` / `5` → v2、`6` 與更新版本 → v3；版本存在卻無法歸類時為
 * `unknown`；完全沒有版本欄位時回傳 undefined /
 * `4`/`5` → v2, `6` and newer → v3; an existing but unclassifiable version
 * yields `unknown`, while a missing version field yields undefined
 */
function _detectYarnLockVersionWithMetadataCore(metaVersion) {
    /**
     * Berry 的 lockfile 格式版本與 yarn 版本並非 1:1 對應，
     * 因此以固定對照（4、5 → v2）搭配「大於 6 → v3」的預設推論，
     * 讓未來新增的格式版本仍可被歸入目前最新的 v3。
     *
     * Berry lockfile format versions do not map 1:1 onto yarn versions, so a
     * fixed table (4, 5 → v2) is combined with a "greater than 6 → v3"
     * default, letting future format versions still land on the newest v3.
     */
    switch (metaVersion) {
        case '4':
        case '5':
            return yarnlock_types_1.EnumDetectYarnLock.v2;
        case '6':
            return yarnlock_types_1.EnumDetectYarnLock.v3;
        default:
            /**
             * 有版本欄位卻不在表內時：大於 6 視為 v3，
             * 其他（例如無法轉成數字的雜訊）則回報 unknown 以保留除錯線索。
             *
             * When a version exists but is not in the table: anything above 6
             * is treated as v3, while other values (e.g. non-numeric noise)
             * are reported as unknown to preserve a debugging hint.
             */
            if (+metaVersion > 6) {
                return yarnlock_types_1.EnumDetectYarnLock.v3;
            }
            else if (metaVersion === null || metaVersion === void 0 ? void 0 : metaVersion.length) {
                return yarnlock_types_1.EnumDetectYarnLock.unknown;
            }
    }
}
//# sourceMappingURL=detectYarnLockVersionWithMetadata.js.map