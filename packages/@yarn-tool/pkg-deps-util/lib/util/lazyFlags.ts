/**
 * 由布林選項產生 CLI flag (Build CLI flags from boolean options)
 *
 * 只把為 true 的選項轉成 `--flag`，可避免把未指定的選項以 `--xxx false`
 * 的形式送進指令列而改變 yarn 的預設行為。
 *
 * Only `true` options become `--flag`, avoiding `--xxx false` on the command
 * line which could override yarn's own defaults.
 */

/**
 * 產生 CLI flag 陣列 (Produce an array of CLI flags)
 *
 * Produce `--flag` strings for the keys that are enabled.
 *
 * @param keys 要檢查的選項名稱 (Option names to inspect)
 * @param argv 已解析的布林選項 (Parsed boolean options)
 *
 * @returns 依 `keys` 順序產生的 `--key` 陣列；未啟用的選項不會出現
 *
 * An array of `--key` in `keys` order; disabled options are omitted.
 */
export function lazyFlags(keys: string[], argv: {
	[k: string]: boolean,
}): string[]
{
	return keys.reduce((a, key) => {
		if (argv[key])
		{
			a.push('--' + key);
		}
		return a;
	}, [] as string[])
}
