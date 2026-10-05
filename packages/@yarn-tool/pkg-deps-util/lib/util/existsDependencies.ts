/**
 * 依賴存在性檢查 (Dependency existence check)
 *
 * 依賴可能被放在三種欄位之一，因此必須逐一檢查才能判斷套件是否已被管理。
 *
 * A dependency may live in any of three fields, so all of them must be
 * checked before deciding that a package is already managed.
 */
import { IPackageJson } from '@ts-type/package-dts/package-json';

/**
 * 檢查套件是否已存在於依賴欄位 (Check whether a package exists in dependency fields)
 *
 * Check whether a package is already listed in any dependency field.
 *
 * @param name 套件名稱（不含版本） (Package name without version)
 * @param pkg package.json 內容，或僅含依賴欄位的部分物件
 *            package.json, or a partial object with only dependency fields
 *
 * @returns 找到的版本字串；三欄位皆無時回傳 `undefined`
 *
 * The matched version string, or `undefined` when none of the fields list it.
 */
export function existsDependencies(name: string,
	pkg: IPackageJson | Partial<Record<'dependencies' | 'devDependencies' | 'optionalDependencies', Record<string, string>>>,
)
{
	/**
	 * 以 `??` 串接：版本字串不會是 `null`/`undefined`，因此遇到第一個命中的欄位即可停止
	 *
	 * Chained with `??`: versions are never null/undefined, so the first hit wins
	 * and the remaining lookups are skipped.
	 */
	return pkg.dependencies?.[name]
		?? pkg.devDependencies?.[name]
		?? pkg.optionalDependencies?.[name]
		;
}
