/**
 * 註冊 `@types/*` 自動安裝相關的 yargs 選項 (Register options for auto-installing `@types/*`)
 *
 * 在一般 `yarn add` 選項之上追加批量處理的開關，
 * 讓 CLI 可依 `--auto` / `--all` 決定要掃描哪些依賴。
 *
 * Extends the regular `yarn add` options with bulk-processing switches so the
 * CLI can decide which dependencies to scan via `--auto` / `--all`.
 */
import { Argv } from 'yargs';
import { setupYarnAddToYargs } from './setupYarnAddToYargs';

/**
 * 註冊 types 相關選項 (Register the types-related options)
 *
 * Register the `@types/*` install options on the given yargs instance.
 *
 * @param yargs yargs 實例 (The yargs instance)
 *
 * @returns 同一個 yargs 實例，已包含 `yarn add` 選項與 types 選項
 *
 * The same yargs instance, already containing both the `yarn add` and the
 * types options.
 */
export function setupYarnAddTypesToYargs<T extends any>(yargs: Argv<T>)
{
	return setupYarnAddToYargs(yargs, {
		allowEmptyName: true,
	})
		/**
		 * `auto` / `all` 決定掃描來源，`AA` 為兩者的捷徑；
		 * 以捷徑減少長指令在終端機輸入時的出錯機會。
		 *
		 * `auto` / `all` choose the scan source and `AA` is a shortcut for both,
		 * reducing typos when typing long commands in a terminal.
		 */
		.option('auto', {
			desc: `auto install from package.json`,
			boolean: true,
		})
		.option('all', {
			desc: `dependencies, devDependencies from package.json`,
			boolean: true,
		})
		.option('AA', {
			desc: `--auto --all`,
			boolean: true,
		})
		/**
		 * 關閉 strict：此指令常由腳本附加未知參數，
		 * 嚴格模式會直接中斷既有的自動化流程。
		 *
		 * Strict mode is disabled because scripts often append unknown arguments
		 * and a strict parse would break existing automation.
		 */
		.strict(false)
}
