/**
 * 註冊 `yarn add` 相關的 yargs 選項 (Register `yarn add` options in yargs)
 *
 * 把 `yarn add` 支援的參數集中註冊，讓各 CLI 指令不必重複宣告同一組選項，
 * 也能確保 `flagsYarnAdd` 與實際解析到的參數名稱一致。
 *
 * Centralises the `yarn add` arguments so each CLI command does not redeclare
 * them, and so `flagsYarnAdd` always matches the names actually parsed.
 */
import { Argv } from 'yargs';

/**
 * 註冊 `yarn add` 選項 (Register `yarn add` options)
 *
 * Register the `yarn add` options on the given yargs instance.
 *
 * @param yargs yargs 實例 (The yargs instance)
 * @param opts 額外行為開關，目前支援 `allowEmptyName`
 *             Extra behaviour switches, currently `allowEmptyName`
 *
 * @returns 同一個 yargs 實例，可繼續鏈式註冊其他選項
 *
 * The same yargs instance, so further options can be chained on.
 */
export function setupYarnAddToYargs<T extends any>(yargs: Argv<T>, opts: {
	allowEmptyName?: boolean,
} = {})
{
	return yargs
		/**
		 * 依賴欄位選項：`--dev` / `--peer` / `--optional` 決定寫入哪一個欄位，
		 * 別名沿用 yarn 自帶的單字母參數以符合使用者習慣。
		 *
		 * Dependency field options: `--dev` / `--peer` / `--optional` choose the
		 * target field, keeping yarn's own single-letter aliases for familiarity.
		 */
		.option('dev', {
			alias: 'D',
			desc: `install packages to devDependencies.`,
			boolean: true,
		})
		.option('peer', {
			alias: 'P',
			desc: `install packages to peerDependencies.`,
			boolean: true,
		})
		.option('optional', {
			alias: 'O',
			desc: `install packages to optionalDependencies.`,
			boolean: true,
		})
		/**
		 * 版本寫法選項：`--exact` 寫入精確版本、`--tilde` 寫入 `~` range，
		 * 兩者都會影響最終寫進 `package.json` 的字串。
		 *
		 * Version style options: `--exact` writes a precise version and `--tilde`
		 * writes a `~` range; both change the string stored in package.json.
		 */
		.option('exact', {
			alias: 'E',
			desc: `see https://yarnpkg.com/lang/en/docs/cli/add/`,
			boolean: true,
		})
		.option('tilde', {
			alias: 'T',
			desc: `see https://yarnpkg.com/lang/en/docs/cli/add/`,
			boolean: true,
		})
		.option('audit', {
			desc: `see https://yarnpkg.com/lang/en/docs/cli/add/`,
			boolean: true,
		})
		/**
		 * `dedupe` 預設為 true：yarn.lock 去重是本工作區的預設行為，
		 * 只有明確傳入 `--no-dedupe` 時才會關閉。
		 *
		 * `dedupe` defaults to true because lockfile deduplication is this
		 * workspace's default behaviour; it is only turned off via `--no-dedupe`.
		 */
		.option('dedupe', {
			alias: ['d'],
			desc: `Data deduplication for yarn.lock`,
			boolean: true,
			default: true,
		})
		.option('ignore-workspace-root-check', {
			alias: ['W'],
			desc: `see https://yarnpkg.com/lang/en/docs/cli/add/`,
			boolean: true,
		})
		/**
		 * `--types` 會額外嘗試安裝對應的 `@types/*`，
		 * 屬於本套件特有的行為，因此自行撰寫說明而非引用 yarn 文件。
		 *
		 * `--types` also tries to install the matching `@types/*`; this is local
		 * behaviour, so the description is written here instead of linking to yarn.
		 */
		.option('types', {
			alias: ['type'],
			desc: `try auto install @types/* too`,
			boolean: true,
		})
}
