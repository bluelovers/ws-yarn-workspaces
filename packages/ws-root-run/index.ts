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

import findWorkspaceRoot from 'find-yarn-workspace-root2/core';
import crossSpawn, { SpawnSyncOptions, SpawnOptions, SpawnSyncReturns, SpawnASyncReturnsPromise } from 'cross-spawn-extra';

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
export function spawnWsRootRun(argv: string[], opts?: {
	cwd?: string,
	npmClient?: INpmClient,
	spawnOptions?: SpawnOptions,
})
{
	/**
	 * 先解析 workspace 根目錄；找不到時回傳 null，子行程會回退至程序的工作目錄
	 * Resolve the workspace root first; when not found it returns null and the child process falls back to the process cwd
	 */
	let cwd = findWorkspaceRoot(opts?.cwd);

	return crossSpawn.async(opts?.npmClient || 'yarn', [
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
		...opts?.spawnOptions,
		cwd,
	})
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
export function spawnWsRootExec(argv: string[], opts?: {
	cwd?: string,
	npmClient?: INpmClient,
	spawnOptions?: SpawnOptions,
})
{
	/**
	 * 先解析 workspace 根目錄；找不到時回傳 null，子行程會回退至程序的工作目錄
	 * Resolve the workspace root first; when not found it returns null and the child process falls back to the process cwd
	 */
	let cwd = findWorkspaceRoot(opts?.cwd);

	return crossSpawn.async(opts?.npmClient || 'yarn', [
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
		...opts?.spawnOptions,
		cwd,
	})
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
export function spawnWsRootRunSync(argv: string[], opts?: {
	cwd?: string,
	npmClient?: INpmClient,
	spawnOptions?: SpawnSyncOptions,
})
{
	/**
	 * 先解析 workspace 根目錄；找不到時回傳 null，子行程會回退至程序的工作目錄
	 * Resolve the workspace root first; when not found it returns null and the child process falls back to the process cwd
	 */
	let cwd = findWorkspaceRoot(opts?.cwd);

	return crossSpawn.sync(opts?.npmClient || 'yarn', [
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
		...opts?.spawnOptions,
		cwd,
	})
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
export function spawnWsRootExecSync(argv: string[], opts?: {
	cwd?: string,
	npmClient?: INpmClient,
	spawnOptions?: SpawnSyncOptions,
})
{
	/**
	 * 先解析 workspace 根目錄；找不到時回傳 null，子行程會回退至程序的工作目錄
	 * Resolve the workspace root first; when not found it returns null and the child process falls back to the process cwd
	 */
	let cwd = findWorkspaceRoot(opts?.cwd);

	return crossSpawn.sync(opts?.npmClient || 'yarn', [
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
		...opts?.spawnOptions,
		cwd,
	})
}

/**
 * 預設匯出 run 版本，讓 `require('ws-root-spawn')` 可直接取得最常用的入口
 * Default-exports the run variant so `require('ws-root-spawn')` yields the most common entry point
 */
export default spawnWsRootRun
