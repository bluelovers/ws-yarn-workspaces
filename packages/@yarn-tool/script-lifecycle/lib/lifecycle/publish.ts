/**
 * Publish lifecycle configuration.
 * Publish 生命週期配置。
 *
 * Defines the script execution order for npm/yarn publish command.
 * 定義 npm/yarn publish 命令的腳本執行順序。
 *
 * Execution order / 執行順序：
 * 1. prepublish - Runs before publish (deprecated, use prepublishOnly) / 在 publish 之前執行（已棄用，請使用 prepublishOnly）
 * 2. prepare - Runs after install and before publish / 在 install 之後和 publish 之前執行
 * 3. prepublishOnly - Runs before publish (only on npm publish) / 僅在 npm publish 時執行
 * 4. prepack - Runs before the tarball is created / 在建立 tarball 之前執行
 * 5. postpack - Runs after the tarball is created / 在建立 tarball 之後執行
 * 6. publish - The main publish script / 主 publish 腳本
 * 7. postpublish - Runs after publish / 在 publish 之後執行
 *
 * @see https://docs.npmjs.com/cli/v10/using-npm/scripts#life-cycle-scripts
 *
 * @module @yarn-tool/script-lifecycle/lib/lifecycle/publish
 */

import { ILifecycleEntry } from "../types";

export default {
	/** Script name / 腳本名稱 */
	name: "publish" as const,
	/**
	 * Whether to exclude the main script from the list.
	 * 是否在列表中排除主腳本。
	 *
	 * false = include 'publish' in the execution list
	 * false = 在執行列表中包含 'publish'
	 */
	ignoreSelf: false,
	/**
	 * Scripts to run before publish.
	 * 在 publish 之前執行的腳本。
	 *
	 * The publish lifecycle includes multiple preparation scripts:
	 * - prepublish: Legacy hook, runs before publish
	 * - prepare: Runs for both install and publish
	 * - prepublishOnly: Runs only before npm publish
	 * - prepack/postpack: Run around tarball creation
	 *
	 * publish 生命週期包含多個準備腳本：
	 * - prepublish: 舊版鉤子，在 publish 之前執行
	 * - prepare: 在 install 和 publish 時都會執行
	 * - prepublishOnly: 僅在 npm publish 之前執行
	 * - prepack/postpack: 在 tarball 建立前後執行
	 */
	before: [
		"prepublish",
		"prepare",
		"prepublishOnly",
		"prepack",
		"postpack",
	],
	/**
	 * Scripts to run after publish.
	 * 在 publish 之後執行的腳本。
	 */
	after: [
		"postpublish"
	],
} as const satisfies ILifecycleEntry
