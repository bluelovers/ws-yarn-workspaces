/**
 * ncu-ws 專用的 yargs 選項設定 (yargs options for ncu-ws)
 * 說明：在 `@yarn-tool/ncu` 的通用選項之上，追加 workspace 場景才會用到的旗標，
 * 因此 `IArgvRuntime` 會同時帶有兩組選項。
 * Why: it appends workspace-only flags on top of the generic `@yarn-tool/ncu`
 * options, which is why `IArgvRuntime` carries both sets.
 *
 * @module argv
 */
import { Argv } from 'yargs';
import { setupNcuToYargs } from '@yarn-tool/ncu';

/**
 * 設定 ncu-ws 的命令列選項 (Configure ncu-ws CLI options)
 * 相較於 `setupNcuToYargs` 多出：
 * - `resolutions` / `-R`：只處理 resolutions，不更新依賴
 * - `no-safe`：允許跳離目前版本範圍
 * - `AA`：一次啟用「workspace 模式 + 包含根套件」
 * 另附三個常見用法的 `.example()`，方便 `--help` 顯示。
 * Compared to `setupNcuToYargs` it adds:
 * - `resolutions` / `-R`: handle resolutions only, without touching dependencies
 * - `noSafe`: allow leaving the current version range
 * - `AA`: enable both workspace mode and root inclusion in one flag
 * Three common usages are also registered via `.example()` for `--help`.
 *
 * @param yargs - 需帶有 `cwd` 的 yargs 實例 / A yargs instance that carries `cwd`
 */
export function setupNcuToYargs2<T extends any>(yargs: Argv<T & {
	cwd: string,
}>)
{
	return setupNcuToYargs(yargs)
		.option('resolutions', {
			alias: ['R'],
			desc: 'do with resolutions only',
			boolean: true,
		})
		.option('no-safe', {
			boolean: true,
		})
		.option('AA', {
			desc: 'all packages',
			boolean: true,
		})
		.example(`$0 ncu -u`, `check new version and update package.json`)
		.example(`$0 ncu -R`, `check new version of resolutions in package.json`)
		.example(`$0 ncu -u -R`, `check new version of resolutions in package.json and update package.json`)
}
