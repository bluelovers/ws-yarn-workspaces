/**
 * 去除字串開頭的底線、冒號、橫線
 * Remove leading underscores, colons, and hyphens from string
 *
 * @param name - 要處理的腳本名稱
 * @param skipNumber - 是否跳過數字處理
 * @returns 處理後的字串
 *
 * @example
 * trimKey('_test')     // 'test'
 * trimKey(':build')    // 'build'
 * trimKey('--test-1')  // 'test'
 */
export function trimKey(name: string, skipNumber?: boolean)
{
	return name
		.replace(/^[_:\-]+/, '')
		.replace(skipNumber ? /[_:\-]+$/ : /[\d_:\-]+$/, '')
}

/**
 * 取得腳本名稱的第一部分（第一個區段）
 * Extract the first segment (first part) of a script name
 *
 * 將腳本名稱依據底線、冒號、橫線進行分割，取第一個區段作為主要 key。
 * 例如 'pretest:watch' 会返回 'test'，'build:esm' 会返回 'build'。
 *
 * @param name - 要處理的腳本名稱
 * @returns 第一個區段
 *
 * @example
 * firstPartKey('pretest')      // 'test'
 * firstPartKey('build:esm')    // 'build'
 * firstPartKey('postpublish')  // 'publish'
 */
export function firstPartKey(name: string)
{
	let key = trimKey(name);
	let first = key.split(/[_:\-]+/)[0];

	/**
	 * 邊界情況：若名稱開頭就是分隔符（如 ':build'），一般修剪後第一段會是空字串，
	 * 此時改用保留數字的修剪方式重取，避免把 '' 當成基礎鍵而分組錯誤。
	 *
	 * Edge case: if the name starts with a separator (e.g. ':build'), the first
	 * segment would be an empty string after normal trimming; retry with the
	 * number-preserving trim so `''` is not mistaken for the base key.
	 */
	if (first === '')
	{
		key = trimKey(name, true);
		first = key.split(/[_:\-]+/)[0];
	}

	return first
}

/**
 * 從腳本名稱推導分組用的三個鍵值 / Derive the three keys used for grouping from a script name
 *
 * - name：原始腳本名稱不動，供回溯對照 / the untouched original name, for mapping back
 * - key：保留 pre/post 之外的基礎鍵（如 'pretest:watch' -> 'test'）
 *        the base key with pre/post retained only outside the base segment
 * - omitted：再去除 pre/post 前綴（如 'pretest' -> 'test'），用於判斷是否為同一組生命週期腳本
 *            the key with pre/post stripped (e.g. 'pretest' -> 'test'), used to decide
 *            whether scripts belong to the same lifecycle group
 *
 * @param name - 要解析的腳本名稱 / the script name to parse
 * @returns 包含 name、key、omitted 的物件 / an object containing name, key and omitted
 */
export function omitKey(name: string)
{
	const key = firstPartKey(name);
	/**
	 * 只移除最前面的 pre / post：如此一來 'prepublishOnly' 這類內建腳本
	 * 不會被誤砍成 'publishOnly'，仍能與 npm 生命週期清單比對。
	 *
	 * Only the leading pre / post is stripped: built-in names such as
	 * 'prepublishOnly' are not mangled into 'publishOnly', so they can still be
	 * matched against the npm lifecycle list.
	 */
	const omitted = key
		.replace(/^(?:pre|post)/, '')
	;

	return {
		/**
		 * 原始腳本名稱 / the original script name
		 */
		name,
		/**
		 * 去除分隔前後綴後的第一段鍵 / the first-segment key after separators are trimmed
		 */
		key,
		/**
		 * 再去除 pre / post 前綴後的鍵 / the key with the pre / post prefix removed
		 */
		omitted,
	}
}

/**
 * 腳本的預設分組與排序順序 / Default grouping and sorting order for scripts
 * 預設遵循 npm 生命週期腳本順序 / By default it follows the npm lifecycle scripts order
 *
 * 此順序是 handleKeyOrdersCore 的排序基準（第一組放入最終順序），
 * 陣列由上而下即為由前至後的優先度，故新增或對調項目會直接改變排序結果。
 *
 * This order is the baseline used by `handleKeyOrdersCore` (its values are put
 * first into the final order); the array top-to-bottom equals front-to-back
 * priority, so adding or swapping entries directly changes the sort result.
 */
export const defaultNpmScriptsOrder = new Set([

	'serve',
	'start',
	'dev',
	'restart',
	'stop',

	'review',
	'coverage',
	'lint',
	'test',

	'preinstallOnly',
	'install',
	'postinstallOnly',

	'preuninstallOnly',
	'uninstall',
	'postuninstallOnly',

	'build',
	'storybook',
	//'build-storybook',
	'analyze',

	'link',

	'ci',
	'npm',
	'yarn',
	'pnpm',
	'lerna',
	'ws',

	'version',

	'major',
	'minor',
	'patch',
	'prerelease',

	'prepareOnly',
	'prepublish',
	'prepare',
	'prepublishOnly',
	'prepack',
	'pack',
	'postpack',
	'publish',

	'postpublish',

	// yarn-tool
	'postpublishOnly',

	'shrinkwrap',
	'dependencies',

])

/**
 * 需特別對待的「其他腳本」名稱清單 / Names treated as "other" scripts
 *
 * 這些名稱本身不是生命週期腳本，但以 pre 開頭（如 prettier），
 * 若不列於此，omitKey 會把 'prettier' 誤解析成 'ttier' 之類的基礎鍵而分組錯誤。
 *
 * These names are not lifecycle scripts yet start with `pre` (e.g. `prettier`);
 * without this list, `omitKey` would mis-parse `prettier` into a bogus base key
 * such as `ttier` and group it incorrectly.
 */
export const otherScriptNames = new Set([

	'prettier',

])
