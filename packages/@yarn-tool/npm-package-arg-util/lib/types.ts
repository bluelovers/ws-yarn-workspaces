/**
 * @fileoverview Type definitions for npm-package-arg utility
 * @description npm-package-arg 工具的類型定義
 *
 * This module defines the core types and interfaces used throughout
 * the npm-package-arg utility library.
 *
 * 本模組定義了 npm-package-arg 工具函式庫中使用的核心類型和介面。
 */

import _npa, { AliasResult, FileResult, RegistryResult, HostedGitResult, URLResult } from 'npm-package-arg';
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
	 * @example "lodash", "@types/node"
	 */
	name: string;

	/**
	 * The scope of the package (without @ prefix)
	 * 套件的範圍（不含 @ 前綴）
	 *
	 * @example "types" for @types/node, undefined for unscoped packages
	 * @example "@types/node" 的範圍為 "types"，無範圍套件為 undefined
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
	 * @example "4.17.21", "^18.0.0", "latest"
	 */
	semver: string;

	/**
	 * The raw result from npm-package-arg
	 * 來自 npm-package-arg 的原始結果
	 */
	result: IResult;
}

/**
 * Union type for all possible npm-package-arg result types
 * 所有可能的 npm-package-arg 結果類型的聯合類型
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
 * Type alias for the result type string
 * 結果類型字串的類型別名
 *
 * Extracts the 'type' property from IResult as a union type.
 * 提取 IResult 的 'type' 屬性作為聯合類型。
 */
export type IResultType = IResult["type"]

/**
 * @see https://github.com/npm/npm-package-arg?tab=readme-ov-file#using
 */
export interface IOptionsNpaBase
{
	/**
	 * 指定可以獲取此模組的位置和方式。
	 * 如果未包含，則預設為 latest。
	 *
	 * The specifier indicating where and how you can get this module.
	 * Something like: 1.2, ^1.7.17, http://x.com/foo.tgz, git+https://github.com/user/foo, bitbucket:user/foo, file:foo.tar.gz or file:../foo/bar/.
	 * If not included then the default is latest.
	 *
	 * @default 'latest'
	 */
	spec?: string;

	/**
	 * 可選的基礎目錄，用於解析相對路徑。預設為 process.cwd()
	 * Optionally the path to resolve file paths relative to. Defaults to process.cwd()
	 *
	 * @default process.cwd()
	 */
	where?: string;
}

export interface IOptionsNpaUtil extends IOptionsNpaBase
{
	npa?: typeof _npa | typeof npa2;
	shouldHasName?: boolean;
	allowedType?: IResultType[];
}
