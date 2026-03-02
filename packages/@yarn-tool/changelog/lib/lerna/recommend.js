"use strict";
/**
 * 版本推薦模組
 * Version Recommendation Module
 *
 * 根據 conventional commits 分析推薦下一個版本號
 * Recommends next version based on conventional commits analysis
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.recommendVersion = recommendVersion;
const recommend_version_1 = require("@lerna/conventional-commits/lib/recommend-version");
const util_1 = require("./util");
/**
 * 推薦套件的下個版本號
 * Recommend next version for package
 *
 * 分析 Git 歷史中的 conventional commits 來決定版本遞增類型
 * Analyzes conventional commits in Git history to determine version bump type
 *
 * @param {IListableRow} pkg - 套件資訊 / Package information
 * @param {IOptionsWithType<IOptionsRecommendVersion>} [options] - 推薦選項 / Recommendation options
 * @returns {Promise<string>} 推薦的版本號 / Recommended version
 */
function recommendVersion(pkg, options) {
    /**
     * 處理並標準化選項
     * Process and normalize options
     */
    options = (0, util_1.handleOptions)(options);
    /**
     * 呼叫 @lerna/conventional-commits 獲取推薦版本
     * Call @lerna/conventional-commits to get recommended version
     */
    return (0, recommend_version_1.recommendVersion)(pkg, options.type, options);
}
/**
 * 預設匯出推薦函數
 * Default export recommendation function
 */
exports.default = recommendVersion;
//# sourceMappingURL=recommend.js.map