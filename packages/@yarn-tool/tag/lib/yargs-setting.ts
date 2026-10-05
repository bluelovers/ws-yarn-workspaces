/**
 * yt-tag 的 yargs 選項設定
 * yargs option settings for yt-tag
 */

import yargs, { Argv, Omit } from 'yargs';
import { IYargsSync, IYargsUnPackArgv } from '@yarn-tool/types';

/**
 * 註冊 CLI 選項
 * Register CLI options
 *
 * 選項名稱採 kebab-case 以符合 git 慣例，內部再由 bin 轉為 camelCase 欄位。
 * Option names use kebab-case to match git conventions; bin converts them to
 * camelCase fields.
 *
 * @param yargs - yargs 實例 / yargs instance
 * @returns 註冊選項後的 yargs / yargs with options registered
 */
export function setupToYargs<T>(yargs: Argv<T>)
{
	const _return = yargs
		/**
		 * cwd 以 normalize 讓 yargs 統一路徑分隔符，
		 * 避免 Windows 與 POSIX 路徑比較失敗
		 *
		 * cwd is normalized so yargs unifies path separators, preventing
		 * path comparisons from failing on Windows vs POSIX
		 */
		.option('cwd', {
			default: process.cwd(),
			normalize: true,
		})
		/** 前綴以 -t 為短旗標，與 git 的常見用法一致 / Prefix uses -t as its short flag, matching common git usage */
		.option('tag-prefix', {
			alias: 't',
			string: true,
		})
		/** 為 true 時標籤只用版本，不含套件名 / When true the tag uses the version only, without the package name */
		.option('exclude-name', {
			boolean: true,
		})
		/** 標籤訊息預設由標籤名稱推導，此選項可覆寫 / The tag message defaults to the tag name; this overrides it */
		.option('message', {
			alias: 'm',
			string: true,
		})
		/** 以下兩項直接對應 git tag 的 --force 與 --sign / These two map directly to git tag's --force and --sign */
		.option('force-git-tag', {
			alias: 'f',
			boolean: true,
		})
		.option('sign-git-tag', {
			boolean: true,
		})
	;

	return _return as any as IYargsSync<typeof _return>
}

export default setupToYargs
