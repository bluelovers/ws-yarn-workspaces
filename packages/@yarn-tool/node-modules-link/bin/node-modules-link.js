#!/usr/bin/env node
"use strict";
/**
 * node-modules-link 命令列 (CLI) 介面
 * Command-line interface for node-modules-link
 *
 * 以 yargs 解析引數後呼叫 linkToNodeModules，並印出建立連結的結果。
 * Parses arguments with yargs, calls linkToNodeModules, and prints the result.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const yargs_1 = tslib_1.__importDefault(require("yargs"));
const index_1 = tslib_1.__importDefault(require("../index"));
/**
 * 以 yargs 定義所有可用引數；每個選項皆宣告型別，
 * 可讓 yargs 完成型別推導並避免路徑引數中的跳脫字元問題。
 * Defines every supported argument with an explicit type so yargs can infer
 * types and normalize path arguments (avoiding escape issues).
 */
let argv = yargs_1.default
    /**
     * 連結名稱；省略時由來源套件的 package.json 自動讀取
     * Link name; read from the source package.json when omitted
     */
    .option('name', {
    string: true,
})
    /**
     * 目標 node_modules 目錄；normalize 會正規化為一般路徑字串
     * Target node_modules directory; normalize converts it into a plain path string
     */
    .option('targetNodeModulesPath', {
    string: true,
    normalize: true,
})
    /**
     * 來源套件目錄；normalize 與上者相同，確保路徑格式一致
     * Source package directory; normalized the same way to keep path formats consistent
     */
    .option('sourcePackagePath', {
    string: true,
    normalize: true,
})
    /**
     * 路徑推斷的起始目錄，預設 process.cwd()
     * Starting directory for path detection, defaults to process.cwd()
     */
    .option('cwd', {
    string: true,
    normalize: true,
})
    /**
     * 非標準命名的模組目錄名稱（例如 yarn 的 .yarn 結構之外的自訂目錄）
     * Custom modules directory name (e.g. a non-standard directory outside Yarn's layout)
     */
    .option('targetNodeModulesName', {
    string: true,
})
    /**
     * 略過工作區檢查 (Workspace Check)，短參數 -W；
     * 交由 findRoot 判斷是否要求必須存在 workspace 配置。
     * Skips the workspace check (short flag -W); findRoot decides whether a
     * workspace configuration is required.
     */
    .option('skipCheckWorkspace', {
    alias: [
        'W',
    ],
    boolean: true,
})
    .parseSync();
/**
 * CLI 執行時固定傳入 throwError: true，
 * 讓找不到根目錄的失敗直接中斷並回報，而不是靜默回傳不完整結果。
 * The CLI always passes throwError: true so a missing root aborts with an
 * error instead of silently returning an incomplete result.
 *
 * 以 console.dir 印出完整回傳值（含 resultPath），方便除錯與腳本接續處理。
 * console.dir prints the whole return value (including resultPath) for easier
 * debugging and downstream scripting.
 */
console.dir((0, index_1.default)({
    ...argv,
    throwError: true,
}));
//# sourceMappingURL=node-modules-link.js.map