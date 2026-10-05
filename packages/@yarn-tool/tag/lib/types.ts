/**
 * 標籤選項型別定義
 * Tag option type definitions
 */

import { ITSRequireAtLeastOne } from 'ts-type';
import { gitTag, gitTagSync, IOptions } from '@git-lazy/tag';

/**
 * 完整標籤選項：繼承 @git-lazy/tag 的 git 選項並加上套件欄位
 * Full tag options: extends @git-lazy/tag git options with package fields
 */
export interface IOptionsPackageTag extends IOptions
{
	/** 套件目錄，必須等於 findRoot 找到的套件根目錄 / Package dir; must equal the package root found by findRoot */
	cwd: string,
	/** 套件名稱；省略時取自 pkg.name / Package name; falls back to pkg.name */
	name?: string,
	/** 版本號；省略時取自 pkg.version / Version; falls back to pkg.version */
	version?: string,
	/** 標籤前綴（如 v），作用在版本號之前 / Tag prefix (e.g. "v"), applied before the version */
	tagPrefix?: string,
	/** 為 true 時標籤省略 `<name>@` 前段 / When true the tag omits the `<name>@` part */
	excludeName?: boolean,

	/** package.json 內容；省略時由 gitPackageTag 自動載入 / package.json content; loaded automatically by gitPackageTag when omitted */
	pkg?: IPackageJsonWithVersion
}

/**
 * 標籤需要的最小 package.json 欄位
 * Minimal package.json fields needed for tagging
 */
export interface IPackageJsonWithVersion
{
	name: string,
	version: string,
}

/**
 * 輸入用選項：以聯集要求至少能取得版本與名稱，
 * 讓型別層級就擋下「缺 version 也缺 pkg」的呼叫
 *
 * Input options: a union requiring at least a way to obtain version and
 * name, so callers lacking both version and pkg are rejected at type level.
 */
export type IOptionsPackageTagInput = IOptionsPackageTag & (IPackageJsonWithVersion | {
	version: string,
	pkg: IPackageJsonWithVersion
} | {
	name: string,
	pkg: IPackageJsonWithVersion
})
