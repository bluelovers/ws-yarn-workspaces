/**
 * 彙整後的套件對照表：套件名 → 版本清單。
 * The aggregated package map: package name → list of versions.
 */
export interface IComputedPackage
{
	/**
	 * 版本清單已去重並以鬆散 semver 排序，因此可直接逐項比對。
	 * The version list is deduplicated and sorted with loose semver, so it can be compared
	 * element-wise directly.
	 */
	[packagename: string]: string[];
}

/**
 * 一列（Row）解析後的最小資料：只有名稱與版本，其餘欄位對比對無意義。
 * The minimal data after parsing one row: only the name and version matter for comparison.
 */
export interface IParsePackageRow
{
	/**
	 * 套件名稱，不含版本範圍 / The package name, without the version range
	 */
	name: string;
	/**
	 * 此列實際解析出的版本 / The version resolved by this row
	 */
	version: string;
}
