/**
 * @fileoverview Type definitions for npm-package-arg utility
 * @description npm-package-arg 工具的類型定義
 *
 * This module defines the core types and interfaces used throughout
 * the npm-package-arg utility library.
 *
 * 本模組定義了 npm-package-arg 工具函式庫中使用的核心類型和介面。
 */

import _npa, { AliasResult, FileResult, RegistryResult, HostedGitResult, URLResult, Result } from 'npm-package-arg';
import { npa2 } from '..';

/**
 * Interface for parsed package name information
 * 解析套件名稱資訊的介面
 *
 * Represents the result of parsing a package argument string,
 * containing all relevant information about the package.
 *
 * 表示解析套件參數字串的結果，
 * 包含有關套件的所有相關資訊。
 */
export interface IParsePackageName
{
	/**
	 * The type of the package result
	 * 套件結果的類型
	 *
	 * Possible values: 'alias', 'file', 'directory', 'version', 'range', 'tag', 'git', 'remote'
	 * 可能的值：'alias', 'file', 'directory', 'version', 'range', 'tag', 'git', 'remote'
	 */
	type: IResultType,

	/**
	 * The full package name (including scope if present)
	 * 完整的套件名稱（如果存在範圍則包含範圍）
	 *
	 * May be undefined for git URLs without a package name.
	 * 對於沒有套件名稱的 git URL 可能為 undefined。
	 *
	 * @example "lodash", "@types/node"
	 */
	name: string;

	/**
	 * The scope of the package (with @ prefix)
	 * 套件的範圍（含 @ 前綴）
	 *
	 * Only present for scoped packages. The scope includes the @ prefix.
	 * 僅對範圍套件存在。範圍包含 @ 前綴。
	 *
	 * @example "@types" for @types/node
	 */
	scope: string;

	/**
	 * The package name without scope
	 * 不含範圍的套件名稱
	 *
	 * @example "node" for @types/node
	 */
	subname: string;

	/**
	 * The semantic version or range specifier
	 * 語意版本或範圍指定符
	 *
	 * May be undefined for packages without version specification.
	 * 對於沒有版本指定的套件可能為 undefined。
	 *
	 * @example "4.17.21", "^18.0.0", "latest", "*"
	 */
	semver: string;

	/**
	 * The raw result from npm-package-arg
	 * 來自 npm-package-arg 的原始結果
	 */
	result: IResult;
}

/**
 * Union type for all possible npm-package-arg result types with names
 * 所有可能的帶有名稱的 npm-package-arg 結果類型的聯合類型
 *
 * Combines all possible result types from npm-package-arg parsing:
 * - AliasResult: For aliased packages (e.g., "npm:package@version")
 * - FileResult: For local file/directory packages
 * - RegistryResult: For npm registry packages (version, range, tag)
 * - HostedGitResult: For hosted git repositories (GitHub, GitLab, etc.)
 * - URLResult: For git URLs and remote tarballs
 *
 * 結合 npm-package-arg 解析的所有可能結果類型：
 * - AliasResult: 別名套件（例如："npm:package@version"）
 * - FileResult: 本地檔案/目錄套件
 * - RegistryResult: npm registry 套件（version、range、tag）
 * - HostedGitResult: 託管的 git 儲存庫（GitHub、GitLab 等）
 * - URLResult: git URL 和遠端 tarball
 */
export type IResult = AliasResult | FileResult | RegistryResult | HostedGitResult | URLResult;

/**
 * Union type for all possible npm-package-arg result types (including those without names)
 * 所有可能的 npm-package-arg 結果類型的聯合類型（包含沒有名稱的）
 *
 * This type extends IResult to include the base Result type which may not have a name.
 * Use this when parsing git URLs or other specs that might not include a package name.
 *
 * 此類型擴展 IResult 以包含可能沒有名稱的基礎 Result 類型。
 * 當解析 git URL 或其他可能不包含套件名稱的規格時使用此類型。
 */
export type IResultAll = IResult | Result;

/**
 * Type alias for the result type string
 * 結果類型字串的類型別名
 *
 * Extracts the 'type' property from IResult as a union type.
 * 提取 IResult 的 'type' 屬性作為聯合類型。
 *
 * Possible values: 'alias', 'file', 'directory', 'version', 'range', 'tag', 'git', 'remote'
 * 可能的值：'alias', 'file', 'directory', 'version', 'range', 'tag', 'git', 'remote'
 */
export type IResultType = IResult["type"]

/**
 * Base options for npm-package-arg parsing
 * npm-package-arg 解析的基礎選項
 *
 * @see https://github.com/npm/npm-package-arg?tab=readme-ov-file#using
 */
export interface IOptionsNpaBase
{
	/**
	 * The specifier indicating where and how you can get this module.
	 * Something like: 1.2, ^1.7.17, http://x.com/foo.tgz, git+https://github.com/user/foo,
	 * bitbucket:user/foo, file:foo.tar.gz or file:../foo/bar/.
	 * If not included then the default is latest.
	 *
	 * 指定可以獲取此模組的位置和方式。
	 * 例如：1.2, ^1.7.17, http://x.com/foo.tgz, git+https://github.com/user/foo,
	 * bitbucket:user/foo, file:foo.tar.gz 或 file:../foo/bar/。
	 * 如果未包含，則預設為 latest。
	 *
	 * @default 'latest'
	 */
	spec?: string;

	/**
	 * Optionally the path to resolve file paths relative to.
	 * Defaults to process.cwd()
	 *
	 * 可選的基礎目錄，用於解析相對路徑。
	 * 預設為 process.cwd()
	 *
	 * @default process.cwd()
	 */
	where?: string;
}

/**
 * Extended options for npm-package-arg utility
 * npm-package-arg 工具的擴展選項
 *
 * This interface extends the base options with additional validation
 * and customization options for the utility functions.
 *
 * 此介面擴展了基礎選項，增加了額外的驗證和自定義選項。
 */
export interface IOptionsNpaUtil extends IOptionsNpaBase
{
	/**
	 * Custom npa function to use for parsing
	 * 用於解析的自定義 npa 函數
	 *
	 * Allows overriding the default npa implementation.
	 * 允許覆蓋預設的 npa 實現。
	 */
	npa?: typeof _npa | typeof npa2;

	/**
	 * Whether to require that the result has a valid name
	 * 是否要求結果具有有效的名稱
	 *
	 * When true, parsing will throw if the result doesn't have a name.
	 * Git URLs and some other specs may not have names.
	 *
	 * 當為 true 時，如果結果沒有名稱則解析會拋出錯誤。
	 * git URL 和某些其他規格可能沒有名稱。
	 *
	 * @default true for most types, false for git/directory types
	 */
	shouldHasName?: boolean;

	/**
	 * Array of allowed result types
	 * 允許的結果類型陣列
	 *
	 * When specified, parsing will throw if the result type is not in this array.
	 * Useful for restricting to specific package types.
	 *
	 * 當指定時，如果結果類型不在此陣列中則解析會拋出錯誤。
	 * 用於限制為特定的套件類型。
	 *
	 * @example ['version', 'range', 'tag'] // Only allow registry packages
	 */
	allowedType?: IResultType[];
}