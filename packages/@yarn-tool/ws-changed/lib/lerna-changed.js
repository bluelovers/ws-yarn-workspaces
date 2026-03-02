"use strict";
/**
 * Lerna Changed 模組
 * Lerna Changed Module
 *
 * 使用 Lerna 獲取工作區中已變更的套件列表
 * Uses Lerna to get list of changed packages in workspace
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.lernaChanged = lernaChanged;
const tslib_1 = require("tslib");
const cross_spawn_extra_1 = tslib_1.__importDefault(require("cross-spawn-extra"));
const find_root_1 = require("@yarn-tool/find-root");
const util_1 = require("ws-pkg-list/lib/util");
/**
 * 獲取 Lerna 變更的套件列表
 * Get list of packages changed according to Lerna
 *
 * 執行 `lerna changed` 命令並解析輸出
 * Executes `lerna changed` command and parses output
 *
 * @param {string} [cwd] - 工作目錄 / Working directory
 * @param {Object} [options] - 選項 / Options
 * @param {string} [options.lernaBin] - Lerna 執行檔路徑 / Lerna binary path
 * @returns {Object} 包含 cwd 和變更套件列表的物件 / Object containing cwd and changed packages list
 */
function lernaChanged(cwd, options) {
    var _a;
    /**
     * 查找工作區根目錄
     * Find workspace root directory
     */
    cwd = (0, find_root_1.findRoot)({
        cwd: cwd !== null && cwd !== void 0 ? cwd : process.cwd(),
        throwError: true,
    }).root;
    /**
     * 執行 lerna changed 命令
     * Execute lerna changed command
     */
    let cp = cross_spawn_extra_1.default.sync((_a = options === null || options === void 0 ? void 0 : options.lernaBin) !== null && _a !== void 0 ? _a : 'lerna', [
        'changed',
        '--loglevel=silent',
        '--json',
    ], {
        cwd,
        stripAnsi: true,
    });
    /**
     * 解析命令輸出
     * Parse command output
     */
    let out = cp.stdout.toString().trim();
    /**
     * 解析 JSON 輸出為套件列表
     * Parse JSON output to package list
     */
    let list = (out.length ? JSON.parse(out) : []);
    /**
     * 標準化套件列表資訊
     * Normalize package list info
     */
    list = (0, util_1.normalizeListableExtra)(list, cwd);
    return {
        cwd,
        list,
    };
}
/**
 * 預設匯出函數
 * Default export function
 */
exports.default = lernaChanged;
//# sourceMappingURL=lerna-changed.js.map