"use strict";
/**
 * Changelog 更新模組
 * Changelog Update Module
 *
 * 使用 conventional commits 更新套件的 CHANGELOG.md
 * Updates package CHANGELOG.md using conventional commits
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateChangelog = updateChangelog;
const update_changelog_1 = require("@lerna/conventional-commits/lib/update-changelog");
const util_1 = require("./util");
const upath2_1 = require("upath2");
/**
 * 更新指定套件的 Changelog
 * Update changelog for specified package
 *
 * @param {IListableRow} pkg - 套件資訊 / Package information
 * @param {IOptionsWithType<IOptionsUpdateChangelog>} [options] - 更新選項 / Update options
 * @returns {Promise<IReturnTypeUpdateChangelog>} 更新結果 / Update result
 */
function updateChangelog(pkg, options) {
    var _a;
    /**
     * 處理並標準化選項
     * Process and normalize options
     */
    options = (0, util_1.handleOptions)(options);
    /**
     * 設定版本號，優先使用選項中的版本，否則使用套件目前版本
     * Set version, prioritize option version or use package current version
     */
    let version = (_a = options.version) !== null && _a !== void 0 ? _a : pkg.version;
    options.version = version;
    /**
     * 呼叫 @lerna/conventional-commits 更新 Changelog
     * Call @lerna/conventional-commits to update changelog
     */
    return (0, update_changelog_1.updateChangelog)({
        ...pkg,
        version,
    }, options.type, options)
        .then((data) => {
        return {
            ...data,
            /**
             * 標準化日誌路徑
             * Normalize log path
             */
            logPath: (0, upath2_1.normalize)(data.logPath),
            version,
        };
    });
}
/**
 * 預設匯出更新函數
 * Default export update function
 */
exports.default = updateChangelog;
//# sourceMappingURL=update.js.map