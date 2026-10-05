#!/usr/bin/env node

/**
 * ws-root-spawn 命令列介面
 * ws-root-spawn command line interface
 *
 * 解析第一個參數為 'run' 或 'exec'，並在工作區根目錄同步執行對應指令；
 * 其餘參數原樣轉交給子指令。
 * Reads the first argument as 'run' or 'exec' and runs the matching command synchronously
 * in the workspace root; the remaining arguments are forwarded verbatim.
 *
 * 用法 / Usage:
 *   ws-root-spawn run build
 *   ws-root-spawn exec some-command --flag
 *
 * @packageDocumentation
 */

import { spawnWsRootExecSync, spawnWsRootRunSync } from '../index';
import crossSpawn, { SpawnSyncReturns } from 'cross-spawn-extra';

/**
 * 忽略 node 與腳本路徑，其餘即為使用者輸入的參數
 * Drop node and the script path; what remains is the user-supplied arguments
 */
let argv = process.argv.slice(2);

/**
 * 預留的子行程結果，目前未被指派
 * Reserved child process result, currently never assigned
 *
 * TODO: spawnWsRootRunSync / spawnWsRootExecSync 的回傳值尚未存入 cp，
 *       導致下方 `cp.status` 讀取 undefined 的屬性而拋出 TypeError。
 *       修正時應改為 `cp = spawnWsRootRunSync(...)` 以正確傳遞退出碼 (Exit Code)。
 * TODO: the return values of spawnWsRootRunSync / spawnWsRootExecSync are never stored in cp,
 *       so `cp.status` below reads a property of undefined and throws a TypeError.
 *       The fix is `cp = spawnWsRootRunSync(...)` so the exit code is propagated correctly.
 */
let cp: SpawnSyncReturns<Buffer>;

/**
 * 第一個參數決定子指令類型：'run' 走 package.json scripts，'exec' 走任意指令
 * The first argument selects the subcommand: 'run' runs package.json scripts, 'exec' runs an arbitrary command
 */
if (argv[0] === 'run')
{
	spawnWsRootRunSync(argv.slice(1))
}
else if (argv[0] === 'exec')
{
	spawnWsRootExecSync(argv.slice(1))
}
else
{
	/**
	 * 未指定或指定錯誤的子指令直接失敗，避免以預設值執行非預期的指令
	 * Fail fast when the subcommand is missing or invalid, so no unexpected default command is executed
	 */
	throw new Error(`failed spawn script, ${argv}`)
}

/**
 * 有取得子行程結果時，以其退出碼結束本程序
 * Exit with the child process status when a result was captured
 *
 * 邊界情況：cp 目前永遠未被指派，此區塊在執行期會拋出 TypeError；
 * 待上方 TODO 修正後，狀態為 0（falsy）時不中斷程序，非 0 才會傳遞退出碼。
 * Edge case: cp is currently never assigned, so this block throws at runtime;
 * after the TODO above is fixed, a status of 0 (falsy) leaves the process alone and only non-zero propagates.
 */
if (cp.status)
{
	process.exit(cp.status)
}
