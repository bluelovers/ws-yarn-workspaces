"use strict";
/**
 * 在工作區根目錄執行 run / exec 指令
 * Run `run` / `exec` commands in the workspace root directory
 *
 * 本模組提供四種啟動子行程 (Child Process) 的方式：
 * This module provides four ways to spawn a child process:
 * `spawnWsRootRun`、`spawnWsRootExec`（非同步 / async）
 * `spawnWsRootRun` and `spawnWsRootExec` (async)
 * 與 `spawnWsRootRunSync`、`spawnWsRootExecSync`（同步 / sync）。
 * plus `spawnWsRootRunSync` and `spawnWsRootExecSync` (sync).
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.spawnWsRootRun = spawnWsRootRun;
exports.spawnWsRootExec = spawnWsRootExec;
exports.spawnWsRootRunSync = spawnWsRootRunSync;
exports.spawnWsRootExecSync = spawnWsRootExecSync;
const tslib_1 = require("tslib");
const core_1 = tslib_1.__importDefault(require("find-yarn-workspace-root2/core"));
const cross_spawn_extra_1 = tslib_1.__importDefault(require("cross-spawn-extra"));
/**
 * 在工作區根目錄以非同步方式執行 `<npmClient> run <argv...>`
 * Run `<npmClient> run <argv...>` in the workspace root directory (async)
 *
 * @param {string[]} argv - 傳給 run 子指令的參數 / Arguments passed to the run subcommand
 * @param {Object} [opts] - 其他選項 / Additional options
 * @param {string} [opts.cwd] - 起始目錄，會先解析為 workspace 根目錄 / Starting directory, resolved to the workspace root first
 * @param {INpmClient} [opts.npmClient] - npm 用戶端，預設 'yarn' / npm client, defaults to 'yarn'
 * @param {SpawnOptions} [opts.spawnOptions] - 其餘 child process 選項 / Extra child process options
 * @returns {SpawnASyncReturnsPromise<Buffer>} 非同步的 spawn 結果 / Async spawn result
 *
 * @example
 * await spawnWsRootRun(['build'], { cwd: __dirname });
 */
function spawnWsRootRun(argv, opts) {
    /**
     * 先解析 workspace 根目錄；找不到時回傳 null，子行程會回退至程序的工作目錄
     * Resolve the workspace root first; when not found it returns null and the child process falls back to the process cwd
     */
    let cwd = (0, core_1.default)(opts === null || opts === void 0 ? void 0 : opts.cwd);
    return cross_spawn_extra_1.default.async((opts === null || opts === void 0 ? void 0 : opts.npmClient) || 'yarn', [
        'run',
        ...argv,
    ], {
        /**
         * 展開順序不可任意調整：stdio 先給出預設值讓 spawnOptions 覆寫，
         * cwd 放在最後以確保「在根目錄執行」不被呼叫者意外覆寫
         * The order is intentional: stdio is the default that spawnOptions may override,
         * while cwd is last so "run at the root" cannot be accidentally overridden by the caller
         */
        stdio: 'inherit',
        ...opts === null || opts === void 0 ? void 0 : opts.spawnOptions,
        cwd,
    });
}
/**
 * 在工作區根目錄以非同步方式執行 `<npmClient> exec <argv...>`
 * Run `<npmClient> exec <argv...>` in the workspace root directory (async)
 *
 * @param {string[]} argv - 傳給 exec 子指令的參數 / Arguments passed to the exec subcommand
 * @param {Object} [opts] - 其他選項 / Additional options
 * @param {string} [opts.cwd] - 起始目錄，會先解析為 workspace 根目錄 / Starting directory, resolved to the workspace root first
 * @param {INpmClient} [opts.npmClient] - npm 用戶端，預設 'yarn' / npm client, defaults to 'yarn'
 * @param {SpawnOptions} [opts.spawnOptions] - 其餘 child process 選項 / Extra child process options
 * @returns {SpawnASyncReturnsPromise<Buffer>} 非同步的 spawn 結果 / Async spawn result
 *
 * @example
 * await spawnWsRootExec(['tsc', '-v']);
 */
function spawnWsRootExec(argv, opts) {
    /**
     * 先解析 workspace 根目錄；找不到時回傳 null，子行程會回退至程序的工作目錄
     * Resolve the workspace root first; when not found it returns null and the child process falls back to the process cwd
     */
    let cwd = (0, core_1.default)(opts === null || opts === void 0 ? void 0 : opts.cwd);
    return cross_spawn_extra_1.default.async((opts === null || opts === void 0 ? void 0 : opts.npmClient) || 'yarn', [
        'exec',
        ...argv,
    ], {
        /**
         * 展開順序不可任意調整：stdio 先給出預設值讓 spawnOptions 覆寫，
         * cwd 放在最後以確保「在根目錄執行」不被呼叫者意外覆寫
         * The order is intentional: stdio is the default that spawnOptions may override,
         * while cwd is last so "run at the root" cannot be accidentally overridden by the caller
         */
        stdio: 'inherit',
        ...opts === null || opts === void 0 ? void 0 : opts.spawnOptions,
        cwd,
    });
}
/**
 * 在工作區根目錄以同步方式執行 `<npmClient> run <argv...>`
 * Run `<npmClient> run <argv...>` in the workspace root directory (sync)
 *
 * 適合 CLI 腳本：同步等待子行程結束後才繼續，方便接續處理退出碼。
 * Suited to CLI scripts: it blocks until the child process exits, making exit-code handling straightforward.
 *
 * @param {string[]} argv - 傳給 run 子指令的參數 / Arguments passed to the run subcommand
 * @param {Object} [opts] - 其他選項 / Additional options
 * @param {string} [opts.cwd] - 起始目錄，會先解析為 workspace 根目錄 / Starting directory, resolved to the workspace root first
 * @param {INpmClient} [opts.npmClient] - npm 用戶端，預設 'yarn' / npm client, defaults to 'yarn'
 * @param {SpawnSyncOptions} [opts.spawnOptions] - 其餘 child process 選項 / Extra child process options
 * @returns {SpawnSyncReturns<Buffer>} 同步的 spawn 結果 / Synchronous spawn result
 *
 * @example
 * const result = spawnWsRootRunSync(['build']);
 */
function spawnWsRootRunSync(argv, opts) {
    /**
     * 先解析 workspace 根目錄；找不到時回傳 null，子行程會回退至程序的工作目錄
     * Resolve the workspace root first; when not found it returns null and the child process falls back to the process cwd
     */
    let cwd = (0, core_1.default)(opts === null || opts === void 0 ? void 0 : opts.cwd);
    return cross_spawn_extra_1.default.sync((opts === null || opts === void 0 ? void 0 : opts.npmClient) || 'yarn', [
        'run',
        ...argv,
    ], {
        /**
         * 展開順序不可任意調整：stdio 先給出預設值讓 spawnOptions 覆寫，
         * cwd 放在最後以確保「在根目錄執行」不被呼叫者意外覆寫
         * The order is intentional: stdio is the default that spawnOptions may override,
         * while cwd is last so "run at the root" cannot be accidentally overridden by the caller
         */
        stdio: 'inherit',
        ...opts === null || opts === void 0 ? void 0 : opts.spawnOptions,
        cwd,
    });
}
/**
 * 在工作區根目錄以同步方式執行 `<npmClient> exec <argv...>`
 * Run `<npmClient> exec <argv...>` in the workspace root directory (sync)
 *
 * 適合 CLI 腳本：同步等待子行程結束後才繼續，方便接續處理退出碼。
 * Suited to CLI scripts: it blocks until the child process exits, making exit-code handling straightforward.
 *
 * @param {string[]} argv - 傳給 exec 子指令的參數 / Arguments passed to the exec subcommand
 * @param {Object} [opts] - 其他選項 / Additional options
 * @param {string} [opts.cwd] - 起始目錄，會先解析為 workspace 根目錄 / Starting directory, resolved to the workspace root first
 * @param {INpmClient} [opts.npmClient] - npm 用戶端，預設 'yarn' / npm client, defaults to 'yarn'
 * @param {SpawnSyncOptions} [opts.spawnOptions] - 其餘 child process 選項 / Extra child process options
 * @returns {SpawnSyncReturns<Buffer>} 同步的 spawn 結果 / Synchronous spawn result
 *
 * @example
 * const result = spawnWsRootExecSync(['some-command']);
 */
function spawnWsRootExecSync(argv, opts) {
    /**
     * 先解析 workspace 根目錄；找不到時回傳 null，子行程會回退至程序的工作目錄
     * Resolve the workspace root first; when not found it returns null and the child process falls back to the process cwd
     */
    let cwd = (0, core_1.default)(opts === null || opts === void 0 ? void 0 : opts.cwd);
    return cross_spawn_extra_1.default.sync((opts === null || opts === void 0 ? void 0 : opts.npmClient) || 'yarn', [
        'exec',
        ...argv,
    ], {
        /**
         * 展開順序不可任意調整：stdio 先給出預設值讓 spawnOptions 覆寫，
         * cwd 放在最後以確保「在根目錄執行」不被呼叫者意外覆寫
         * The order is intentional: stdio is the default that spawnOptions may override,
         * while cwd is last so "run at the root" cannot be accidentally overridden by the caller
         */
        stdio: 'inherit',
        ...opts === null || opts === void 0 ? void 0 : opts.spawnOptions,
        cwd,
    });
}
/**
 * 預設匯出 run 版本，讓 `require('ws-root-spawn')` 可直接取得最常用的入口
 * Default-exports the run variant so `require('ws-root-spawn')` yields the most common entry point
 */
exports.default = spawnWsRootRun;
//# sourceMappingURL=index.js.map