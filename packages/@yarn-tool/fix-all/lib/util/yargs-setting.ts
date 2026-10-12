/**
 * @yarn-tool/fix-all/lib/util/yargs-setting
 *
 * yargs 選項設定模組
 * yargs options setup module
 *
 * 將 npmAutoFixAll 的選項註冊到 yargs，
 * 讓 CLI 與程式化 API 共用同一組選項名稱與別名
 * Registers npmAutoFixAll options into yargs so that the CLI and the
 * programmatic API share the same option names and aliases
 */
import { Argv } from 'yargs';
import { IYargsSync, IYargsUnPackArgv } from '@yarn-tool/types';

/**
 * 註冊自動修復相關的 yargs 選項
 * Register yargs options related to auto-fix
 *
 * 選項定義與 INpmAutoFixAll 介面一一對應；別名（-O / -S）是為了讓 CLI
 * 操作更簡短，同時保留完整名稱以利閱讀指令歷程
 * Option definitions map one-to-one with the INpmAutoFixAll interface;
 * aliases (-O / -S) keep the CLI short while full names remain for
 * readable command history
 *
 * @param yargs - 要擴充的 yargs 實例 / The yargs instance to extend
 * @returns 帶有選項定義的 yargs 實例（以 IYargsSync 型別回傳）/ The yargs instance with options defined (typed as IYargsSync)
 */
export function setupToYargs<T>(yargs: Argv<T>)
{
	const _return = yargs
		.option('overwriteHostedGitInfo', {
			boolean: true,
			alias: ['O', 'overwrite'],
			describe: 'Overwrite hosted git info (homepage / repository / bugs)',
		})
		.option('branch', {
			string: true,
			describe: 'Git branch name',
		})
		.option('resetStaticFiles', {
			boolean: true,
			alias: ['S'],
			describe: 'Delete existing static files, copy them again, and force the static file add',
		})
		.option('addStaticFiles', {
			boolean: true,
			describe: 'Auto-detect and add static files (disabled by default)',
		})
		.option('noStaticFiles', {
			boolean: true,
			describe: 'Skip adding static files, taking precedence over addStaticFiles; resetStaticFiles still forces the add',
		})
		.option('noMergeIgnoreFiles', {
			boolean: true,
			describe: 'Disable auto-merging ignore files; when unset, existing rules are captured before the reset and merged back after the copy',
		})
	;

	/**
	 * 以雙重斷言繞過 yargs 泛型推導的限制，
	 * 取得可精確推導選項型別的 IYargsSync 包裝
	 * Double assertion bypasses yargs' generic inference limitation to
	 * obtain the IYargsSync wrapper with precise option type inference
	 */
	return _return as any as IYargsSync<typeof _return>
}
