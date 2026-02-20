/**
 * Created by user on 2020/6/13.
 *
 * 類型定義模組
 * Type definitions module
 */

import { IPackageJson } from '@ts-type/package-dts';
import type { IPathItem } from '@yarn-tool/get-paths-by-type';

/**
 * 類似 package.json 的物件類型
 * Package.json-like object type
 *
 * @description
 * 接受標準的 IPackageJson 或任意物件。
 * Accepts standard IPackageJson or any object.
 */
export type IPackageJsonLike = IPackageJson | Record<string, any>;

/**
 * 核心解析選項介面（與 @yarn-tool/require-resolve 相容）
 * Core resolution options interface (compatible with @yarn-tool/require-resolve)
 */
export interface IOptionsResolveCore
{
	/** 模組解析的搜尋路徑 / Search paths for module resolution */
	paths?: (string | IPathItem)[];
}

/**
 * 擴充解析選項介面（與 @yarn-tool/require-resolve 相容）
 * Extended resolution options interface (compatible with @yarn-tool/require-resolve)
 */
export interface IOptionsResolveExtended extends IOptionsResolveCore
{
	/** 是否包含全域路徑 / Whether to include global paths */
	includeGlobal?: boolean | IPathItem[];
	/** 是否包含當前目錄 / Whether to include current directory */
	includeCurrentDirectory?: boolean;
	/** 工作目錄 / Working directory */
	cwd?: string;
}

/**
 * get-pkg-bin 的選項配置
 * Options configuration for get-pkg-bin
 *
 * @description
 * 此類型定義了取得套件 bin 腳本時所需的選項。
 * This type defines the options needed to get package bin scripts.
 *
 * 支援與 @yarn-tool/require-resolve 相同的擴充選項。
 * Supports the same extended options as @yarn-tool/require-resolve.
 *
 * 必須提供 `name` 或 `pkg` 其中之一。
 * Either `name` or `pkg` must be provided.
 *
 * @example
 * ```typescript
 * // 使用套件名稱
 * const options: IOptions = { name: 'ts-node' };
 *
 * // 使用 package.json 物件
 * const options: IOptions = { pkg: require('./package.json') };
 *
 * // 使用全域路徑搜尋
 * const options: IOptions = {
 *   name: 'typescript',
 *   includeGlobal: true,
 * };
 *
 * // 兩者都提供
 * const options: IOptions = {
 *   name: 'my-package',
 *   pkg: { name: 'my-package', bin: './cli.js' },
 *   pkgRoot: '/path/to/package',
 * };
 * ```
 */
export type IOptions = IOptionsResolveExtended & {
	/**
	 * 套件根目錄路徑
	 * Package root directory path
	 *
	 * @description
	 * 若未提供，會自動從套件名稱解析。
	 * If not provided, will be automatically resolved from package name.
	 */
	pkgRoot?: string,

	/**
	 * 是否使用路徑解析而非 require.resolve
	 * Whether to use path resolution instead of require.resolve
	 *
	 * @description
	 * 若為 true，使用 upath2.resolve 解析路徑。
	 * 若為 false（預設），使用 require.resolve 解析路徑。
	 * If true, uses upath2.resolve to resolve paths.
	 * If false (default), uses require.resolve to resolve paths.
	 */
	usePathResolve?: boolean,

} & ({
	/**
	 * 套件名稱（可選，若有提供 pkg）
	 * Package name (optional if pkg is provided)
	 */
	name?: string,

	/**
	 * package.json 物件（必須）
	 * package.json object (required)
	 */
	pkg: IPackageJsonLike,
} | {
	/**
	 * 套件名稱（必須）
	 * Package name (required)
	 */
	name: string,

	/**
	 * package.json 物件（可選，若提供 name 則自動解析）
	 * package.json object (optional, auto-resolved if name is provided)
	 */
	pkg?: IPackageJsonLike,
});