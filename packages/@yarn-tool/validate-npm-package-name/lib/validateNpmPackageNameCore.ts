
/**
 * npm 套件名稱驗證核心規則
 * Core rules of npm package name validation
 *
 * 規則分為兩類：errors 代表名稱完全不合法（無法發布），
 * warnings 代表舊版 npm 曾允許、現在只會被警告的名稱。
 * The rules fall into two kinds: errors mean the name is simply invalid (unpublishable),
 * while warnings flag names old npm allowed but is now only tolerated with a notice.
 *
 * @module @yarn-tool/validate-npm-package-name/lib/validateNpmPackageNameCore
 */

import { IOptions, scopedPackagePattern } from './types';
import { handleResult } from './handleResult';
import { createNewIsBuiltinModule } from '@yarn-tool/is-builtin-module';

/**
 * 預設黑名單：這些名稱會讓使用者誤以為是系統資源
 * Default blacklist: these names would mislead users into thinking they are system resources
 */
const defaultBlacklist: IOptions["blacklist"] = [
	'node_modules',
	'favicon.ico',
];

/**
 * 驗證 npm 套件名稱
 * Validate an npm package name
 *
 * @param {string} name - 待驗證的名稱 / The name to validate
 * @param {IOptions} [options] - 黑名單與目標 Node.js 版本等選項 / Options such as blacklist and target Node.js version
 * @returns {IResult} 含 warnings 與 errors 的驗證結果 / A validation result carrying warnings and errors
 *
 * @example
 * validate('some-package'); // { validForNewPackages: true, validForOldPackages: true }
 */
export function validate(name: string, options?: IOptions)
{
	const warnings: string[] = [];
	const errors: string[] = [];

	/**
	 * 型別前置檢查：null / undefined / 非字串都無法繼續比對規則，
	 * 因此立刻回傳，避免後續 .length 或 .match 直接拋出例外
	 * Upfront type checks: null, undefined, or non-strings cannot be matched against the rules,
	 * so they return early and prevent later .length or .match calls from throwing
	 */
	if (name === null)
	{
		errors.push('name cannot be null')
		return handleResult(warnings, errors)
	}

	if (name === undefined)
	{
		errors.push('name cannot be undefined')
		return handleResult(warnings, errors)
	}

	if (typeof name !== 'string')
	{
		errors.push('name must be a string')
		return handleResult(warnings, errors)
	}

	/**
	 * 空名稱：錯誤而非警告，因為它不可能被發布
	 * Empty name: an error rather than a warning, because it can never be published
	 */
	if (!name.length)
	{
		errors.push('name length must be greater than zero')
	}

	/**
	 * 不允許以 . 或 _ 開頭，這類名稱在部分檔案系統與 registry 中有特殊含意
	 * Disallow leading . or _; such names carry special meaning in some filesystems and registries
	 */
	if (name.match(/^\./))
	{
		errors.push('name cannot start with a period')
	}

	if (name.match(/^_/))
	{
		errors.push('name cannot start with an underscore')
	}

	/**
	 * trim() 與原字串不同即代表有前後空白（含換行、tab）
	 * A trim() that differs from the original means leading/trailing whitespace (spaces, tabs, newlines)
	 */
	if (name.trim() !== name)
	{
		errors.push('name cannot contain leading or trailing spaces')
	}

	/**
	 * 黑名單比對一律使用小寫名稱，避免大小寫繞過
	 * Blacklist comparison always uses the lowercase name so case differences cannot bypass it
	 */
	const name_lc = name.toLowerCase();

	const blacklist = options?.blacklist ?? defaultBlacklist;

	/**
	 * No funny business
	 * 黑名單同時支援字串與正規表示式：
	 * 字串以完全相等比對，正規表示式則由呼叫端決定要攔截的模式
	 * The blacklist supports both strings and regexps:
	 * strings are compared for exact equality, while regexps let callers block arbitrary patterns
	 */
	blacklist.forEach(function (blacklistedName)
	{
		if (typeof blacklistedName !== 'string' && blacklistedName.test(name) || typeof blacklistedName === 'string' && name_lc === blacklistedName)
		{
			errors.push(blacklistedName + ' is a blacklisted name')
		}
	})

	/**
	 * Generate warnings for stuff that used to be allowed
	 * 以下項目過去合法、現在僅警告：
	 * 這讓既有套件仍能維護，同時提示發布者名稱已不符合新規範。
	 * The following were once legal and now only warn:
	 * existing packages keep working while publishers are nudged toward the new rules.
	 */

	/**
	 * core module names like http, events, util, etc
	 * 以目標 Node.js 版本判斷是否為內建模組名稱
	 * Detect core module names against the targeted Node.js version
	 */
	if (createNewIsBuiltinModule(options).isBuiltinModule(name_lc))
	{
		warnings.push(name_lc + ' is a core module name')
	}

	/**
	 * really-long-package-names-------------------------------such--length-----many---wow
	 * the thisisareallyreallylongpackagenameitshouldpublishdowenowhavealimittothelengthofpackagenames-poch.
	 * 超過 214 字元的名稱曾被允許，現在只警告
	 * Names longer than 214 characters were once allowed and now only warn
	 */
	if (name.length > 214)
	{
		warnings.push('name can no longer contain more than 214 characters')
	}

	/**
	 * mIxeD CaSe nAMEs
	 * 含大寫字母的名稱曾被允許，現在只警告
	 * Names containing capital letters were once allowed and now only warn
	 */
	if (name_lc !== name)
	{
		warnings.push('name can no longer contain capital letters')
	}

	/**
	 * 特殊字元只檢查最後一段（scope 不會被算進來），避免 @scope/name 被誤判
	 * Special characters are checked only on the last segment so @scope/name is not misjudged
	 */
	if (/[~'!()*]/.test(name.split('/').slice(-1)[0]))
	{
		warnings.push('name can no longer contain special characters ("~\'!()*")')
	}

	/**
	 * 名稱若無法原樣通過 encodeURIComponent，
	 * 代表含非 URL 安全字元；此時才需要判斷是否為合法的 scoped 名稱
	 * When a name does not survive encodeURIComponent unchanged it contains non-URL-safe characters;
	 * only then does it make sense to check whether it is a valid scoped name
	 */
	if (encodeURIComponent(name) !== name)
	{
		/**
		 * Maybe it's a scoped package name, like @user/package
		 * scoped 套件的 / 與 @ 會讓整體無法通過 encodeURIComponent，
		 * 因此改以個別檢查 scope 與子名稱來放行
		 * A scoped package's / and @ break encodeURIComponent as a whole,
		 * so the scope and sub name are checked individually to allow it
		 */
		const nameMatch = name.match(scopedPackagePattern);
		if (nameMatch)
		{
			const user = nameMatch[1];
			const pkg = nameMatch[2];
			/**
			 * 兩段都各自通過 URL 安全檢查才算合法 scoped 名稱
			 * The name counts as a valid scoped name only when both parts are URL-safe
			 */
			if (encodeURIComponent(user) === user && encodeURIComponent(pkg) === pkg)
			{
				return handleResult(warnings, errors)
			}
		}

		errors.push('name can only contain URL-friendly characters')
	}

	return handleResult(warnings, errors)
}

export default validate
