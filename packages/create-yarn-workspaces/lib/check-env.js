"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._checkEnv = _checkEnv;
exports._warnCheckEnv = _warnCheckEnv;
exports._confirmCheckEnv = _confirmCheckEnv;
exports._checkInteractive = _checkInteractive;
const tslib_1 = require("tslib");
const fast_glob_1 = require("fast-glob");
const logger_1 = require("debug-color2/logger");
const p = tslib_1.__importStar(require("@clack/prompts"));
/**
 * 檢查目標目錄與其子目錄是否已存在 package.json
 *
 * 掃描 cwd 根目錄與第一層子目錄（排除 node_modules），
 * 產出可供警告輸出或互動介面顯示的報告。
 *
 * @param cwd - 要檢查的目錄
 * @param options - 配置選項（保留供呼叫端傳遞，目前未使用）
 * @returns 環境檢查報告
 */
function _checkEnv(cwd, options = {}) {
    const files = (0, fast_glob_1.sync)([
        'package.json',
        '*/package.json',
        '!node_modules/**',
        '!node_modules',
    ], {
        cwd,
        onlyFiles: true,
        objectMode: false,
        deep: 2,
    }).sort();
    return {
        cwd,
        files,
        /** 任一處已存在 package.json 即視為疑似在錯誤的路徑執行 */
        suspicious: !!files.length,
    };
}
/**
 * 以警告方式列出環境檢查報告並繼續執行
 *
 * 未啟用互動介面時的路徑：只印出警告，維持原有邏輯機制繼續創建。
 *
 * @param report - 環境檢查報告
 */
function _warnCheckEnv(report) {
    _printCheckEnvReport(report);
    logger_1.consoleLogger.warn(`continue anyway`);
}
/**
 * 列出環境檢查報告，並透過 @clack/prompts 詢問是否繼續
 *
 * @param report - 環境檢查報告
 * @returns 使用者選擇繼續時回傳 true；取消或非布林回應（如 Ctrl+C）回傳 false
 */
async function _confirmCheckEnv(report) {
    p.intro(`create-yarn-workspaces`);
    _printCheckEnvReport(report);
    const ret = await p.confirm({
        message: `detected existing package.json, continue anyway?`,
        initialValue: false,
    });
    /** 取消（Ctrl+C / 非布林回應）時不繼續創建 */
    if (typeof ret !== 'boolean') {
        p.outro(`cancelled`);
        return false;
    }
    p.outro(ret ? `continue` : `cancelled`);
    return ret;
}
/**
 * 列出報告中的既有 package.json，供警告與互動介面共用同一份輸出
 */
function _printCheckEnvReport(report) {
    logger_1.consoleLogger.warn(`detected existing package.json in "${report.cwd}", possible wrong path`);
    report.files.forEach(function (file) {
        logger_1.consoleLogger.warn(` - ${file}`);
    });
}
/**
 * 檢測是否具備互動能力
 */
function _checkInteractive() {
    return process.stdout.isTTY && process.stdin.isTTY;
}
//# sourceMappingURL=check-env.js.map