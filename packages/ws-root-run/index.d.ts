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
import { SpawnSyncOptions, SpawnOptions, SpawnSyncReturns, SpawnASyncReturnsPromise } from 'cross-spawn-extra';
/**
 * 可用的 npm 用戶端名稱
 * Available npm client names
 *
 * 除列舉的三個常見選項外，型別同時允許任意字串，
 * 以支援自訂指令（例如 pnpm、yarn-tool）而無需修改本套件型別。
 * Besides the three common options, any string is allowed so custom
 * commands (e.g. pnpm, yarn-tool) work without changing this package's types.
 *
 * @note 空字串會在實作中被 `||` 視為未指定而回退至 'yarn'
 *       An empty string is treated as unspecified by the `||` in the implementation and falls back to 'yarn'
 */
export type INpmClient = string | 'npm' | 'yarn' | 'lerna';
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
export declare function spawnWsRootRun(argv: string[], opts?: {
    cwd?: string;
    npmClient?: INpmClient;
    spawnOptions?: SpawnOptions;
}): SpawnASyncReturnsPromise<Buffer<ArrayBufferLike>>;
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
export declare function spawnWsRootExec(argv: string[], opts?: {
    cwd?: string;
    npmClient?: INpmClient;
    spawnOptions?: SpawnOptions;
}): SpawnASyncReturnsPromise<Buffer<ArrayBufferLike>>;
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
export declare function spawnWsRootRunSync(argv: string[], opts?: {
    cwd?: string;
    npmClient?: INpmClient;
    spawnOptions?: SpawnSyncOptions;
}): SpawnSyncReturns<Buffer<ArrayBufferLike>>;
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
export declare function spawnWsRootExecSync(argv: string[], opts?: {
    cwd?: string;
    npmClient?: INpmClient;
    spawnOptions?: SpawnSyncOptions;
}): SpawnSyncReturns<Buffer<ArrayBufferLike>>;
/**
 * 預設匯出 run 版本，讓 `require('ws-root-spawn')` 可直接取得最常用的入口
 * Default-exports the run variant so `require('ws-root-spawn')` yields the most common entry point
 */
export default spawnWsRootRun;
