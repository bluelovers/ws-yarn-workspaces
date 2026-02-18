/**
 * Yarn Workspace 根目錄尋找工具
 * Yarn Workspace Root Directory Finder
 *
 * 此模組提供尋找 Yarn workspace 根目錄的進階功能，
 * This module provides advanced functionality for finding Yarn workspace root directories,
 * 包含路徑驗證、錯誤處理和斷言函數。
 * including path validation, error handling, and assertion functions.
 *
 * @packageDocumentation
 */

import { relative, normalize as pathNormalize } from 'upath2';
import {
	extractWorkspaces,
	isMatchWorkspaces,
	readPackageJSON,
	findWorkspaceRoot as findYarnWorkspaceRoot,
} from 'find-yarn-workspace-root2/core';
import errcode from 'err-code';
import { pathIsSame, pathIsSame as pathEqual } from 'path-is-same';

import { sync as pkgDir } from 'pkg-dir';
import { ITSPickExtra } from 'ts-type/lib/type/record';

/**
 * findRoot 函數的返回類型
 * Return type for findRoot function
 *
 * 包含 workspace 相關的所有路徑資訊和狀態標記。
 * Contains all path information and status flags related to workspace.
 */
export interface IFindRootReturnType
{
	/** 當前工作目錄 / Current working directory */
	cwd: string,
	/** 當前套件的根目錄 / Current package root directory */
	pkg: string;
	/** Workspace 根目錄 / Workspace root directory */
	ws: string;
	/** 是否存在 workspace 配置 / Whether workspace configuration exists */
	hasWorkspace: boolean;
	/** 當前目錄是否為 workspace 根目錄 / Whether current directory is workspace root */
	isWorkspace: boolean;
	/** 專案根目錄（可能是 workspace 或套件目錄）/ Project root (could be workspace or package directory) */
	root: string;
	/** 當前目錄是否為專案根目錄 / Whether current directory is project root */
	isRoot: boolean
}

/**
 * findRoot 函數的選項配置
 * Options configuration for findRoot function
 */
export interface IFindRootOptions
{
	/** 當前工作目錄 / Current working directory */
	cwd: string;
	/** 是否跳過 workspace 檢查 / Whether to skip workspace check */
	skipCheckWorkspace?: boolean | string;
	/** 找不到時是否拋出錯誤 / Whether to throw error when not found */
	throwError?: boolean;

	/** 是否要求必須有 workspace 配置 / Whether workspace configuration is required */
	shouldHasWorkspaces?: boolean;
	/** 是否要求當前目錄不能是 workspace 根目錄 / Whether current directory should not be workspace root */
	shouldNotWorkspacesRoot?: boolean;
}

/**
 * 延遲初始化版本的 findRoot 函數
 * Lazy initialization version of findRoot function
 *
 * 提供更方便的呼叫方式，選項參數皆為可選。
 * Provides more convenient calling style with all options being optional.
 *
 * @param {Partial<IFindRootOptions>} [options] - 選項配置（部分可選）/ Options configuration (partial)
 * @param {boolean} [_throwError] - 是否在找不到時拋出錯誤 / Whether to throw error when not found
 * @returns {IFindRootReturnType|null} 根目錄資訊物件，若找不到則返回 null / Root directory info object, or null if not found
 *
 * @example
 * const rootData = findRootLazy();
 * console.log(rootData?.root); // 專案根目錄 / Project root
 */
export function findRootLazy(options?: Partial<IFindRootOptions>, _throwError?: boolean)
{
	// 若未提供選項，使用空物件作為預設值
	// Use empty object as default if options not provided
	options ??= {} as any;
	// 若未提供 cwd，使用當前工作目錄
	// Use current working directory if cwd not provided
	options.cwd ??= process.cwd();

	return findRoot(options as IFindRootOptions, _throwError)
}

/**
 * 尋找 Yarn workspace 根目錄的核心函數
 * Core function for finding Yarn workspace root directory
 *
 * 此函數會分析指定目錄，返回包含 workspace 相關資訊的完整物件。
 * This function analyzes the specified directory and returns a complete object with workspace-related information.
 * 支援多種驗證選項和錯誤處理模式。
 * Supports multiple validation options and error handling modes.
 *
 * @param {IFindRootOptions} options - 完整的選項配置 / Complete options configuration
 * @param {boolean} [_throwError] - 是否在找不到時拋出錯誤 / Whether to throw error when not found
 * @returns {IFindRootReturnType|null} 根目錄資訊物件，若找不到則返回 null / Root directory info object, or null if not found
 * @throws {RangeError} 當 options.cwd 為空或無效時 / When options.cwd is empty or invalid
 * @throws {RangeError} 當同時啟用 shouldHasWorkspaces 和 skipCheckWorkspace 時 / When both shouldHasWorkspaces and skipCheckWorkspace are enabled
 * @throws {RangeError} 當找不到套件根目錄且啟用 throwError 時 / When package root not found and throwError is enabled
 */
export function findRoot(options: IFindRootOptions, _throwError?: boolean): IFindRootReturnType
{
	// 驗證 cwd 參數是否有效
	// Validate if cwd parameter is valid
	if (!options.cwd?.length)
	{
		throw new RangeError(`options.cwd is '${options.cwd}'`)
	}

	// 標準化當前工作目錄路徑
	// Normalize current working directory path
	const cwd = pathNormalize(options.cwd);

	// Workspace 根目錄路徑
	// Workspace root directory path
	let ws: string;

	// 若未跳過 workspace 檢查，尋找 workspace 根目錄
	// Find workspace root if not skipping workspace check
	if (!options.skipCheckWorkspace)
	{
		ws = findYarnWorkspaceRoot(cwd);
	}
	// 若同時啟用 shouldHasWorkspaces 和 skipCheckWorkspace，拋出錯誤
	// Throw error if both shouldHasWorkspaces and skipCheckWorkspace are enabled
	else if (options.shouldHasWorkspaces)
	{
		throw errcode(new RangeError(`shouldHasWorkspaces and skipCheckWorkspace should not enable at same time`), {
			options,
		})
	}

	// 使用 pkg-dir 找出最近的套件根目錄
	// Use pkg-dir to find nearest package root directory
	let pkg = pkgDir(cwd);

	// 取得 throwError 選項
	// Get throwError option
	const { throwError = _throwError } = options;

	// 若找不到套件根目錄且需要拋出錯誤
	// If package root not found and need to throw error
	if (pkg == null && (throwError || options.shouldHasWorkspaces))
	{
		const err = errcode(new RangeError(`can't found package root from target directory '${cwd}'`), {
			options,
		});
		throw err;
	}

	// 標準化 workspace 根目錄路徑
	// Normalize workspace root path
	if (typeof ws === 'string')
	{
		ws = pathNormalize(ws);
	}

	// 標準化套件根目錄路徑
	// Normalize package root path
	if (typeof pkg === 'string')
	{
		pkg = pathNormalize(pkg);
	}

	// 將 null 轉換為 undefined 以保持一致性
	// Convert null to undefined for consistency
	pkg ??= void 0;
	ws ??= void 0;

	// 判斷是否存在 workspace 配置
	// Determine if workspace configuration exists
	const hasWorkspace = ws?.length > 0;
	// 判斷當前目錄是否為 workspace 根目錄
	// Determine if current directory is workspace root
	const isWorkspace = hasWorkspace && pathEqual(ws, pkg);
	// 決定專案根目錄（優先使用 workspace 根目錄）
	// Determine project root (prefer workspace root)
	const root = hasWorkspace ? ws : pkg;
	// 判斷當前目錄是否為專案根目錄
	// Determine if current directory is project root
	const isRoot = pathEqual(root, pkg);

	// 若根目錄無效，返回 null
	// Return null if root is invalid
	if (!root?.length)
	{
		return null;
	}

	// 組裝返回結果物件
	// Assemble return result object
	const rootData = {
		cwd,
		pkg,
		ws,
		hasWorkspace,
		isWorkspace,
		root,
		isRoot,
	};

	// 若要求必須有 workspace 配置，執行斷言檢查
	// Execute assertion check if workspace configuration is required
	if (options.shouldHasWorkspaces)
	{
		assertHasWorkspaces(rootData);
	}

	// 若要求不能是 workspace 根目錄，執行斷言檢查
	// Execute assertion check if current directory should not be workspace root
	if (options.shouldNotWorkspacesRoot)
	{
		assertNotWorkspacesRoot(rootData);
	}

	return rootData
}

/**
 * 建立虛擬的根目錄資料物件
 * Create a fake root data object
 *
 * 此函數用於基於現有的 rootData 建立新的資料物件，
 * This function is used to create a new data object based on existing rootData,
 * 可覆寫部分屬性並自動重新計算 isRoot 和 isWorkspace。
 * allowing partial property override with automatic recalculation of isRoot and isWorkspace.
 *
 * @param {IFindRootReturnType} rootData - 原始的根目錄資料 / Original root data
 * @param {ITSPickExtra<IFindRootReturnType, 'pkg'>} input - 要覆寫的屬性 / Properties to override
 * @returns {IFindRootReturnType} 新的根目錄資料物件 / New root data object
 *
 * @example
 * const newRootData = newFakeRootData(rootData, { pkg: '/new/pkg/path' });
 */
export function newFakeRootData(rootData: IFindRootReturnType, input: ITSPickExtra<IFindRootReturnType, 'pkg'>): IFindRootReturnType
{
	// 計算是否為根目錄（若未提供則自動計算）
	// Calculate if it's root directory (auto-calculate if not provided)
	const isRoot = input.isRoot ?? pathIsSame(input.pkg, rootData.root);
	// 計算是否為 workspace 根目錄（若未提供則自動計算）
	// Calculate if it's workspace root (auto-calculate if not provided)
	const isWorkspace = input.isWorkspace ?? pathIsSame(input.pkg, rootData.ws);

	// 合併原始資料和輸入資料
	// Merge original data and input data
	const _rootDataFake: IFindRootReturnType = {
		...rootData,
		...input,
		isRoot,
		isWorkspace,
	};

	return _rootDataFake
}

/**
 * 斷言當前目錄位於 workspace 內
 * Assert that current directory is inside a workspace
 *
 * 若 hasWorkspace 不為 true，則拋出錯誤。
 * Throws an error if hasWorkspace is not true.
 *
 * @template T - IFindRootReturnType 的子類型 / Subtype of IFindRootReturnType
 * @param {T} rootData - 要檢查的根目錄資料 / Root data to check
 * @throws {RangeError} 當不在 workspace 內時 / When not inside a workspace
 */
export function assertHasWorkspaces<T extends IFindRootReturnType>(rootData: T): asserts rootData is T & {
	hasWorkspace: true
}
{
	// 檢查是否存在有效的套件路徑且 hasWorkspace 為 true
	// Check if valid package path exists and hasWorkspace is true
	if (!rootData.pkg?.length || rootData.hasWorkspace !== true)
	{
		throw errcode(new RangeError(`cwd should inside of workspaces root`), {
			rootData,
		})
	}
}

/**
 * 斷言當前目錄不是 workspace 根目錄
 * Assert that current directory is not workspace root
 *
 * 若 isWorkspace 為 true，則拋出錯誤。
 * Throws an error if isWorkspace is true.
 *
 * @template T - IFindRootReturnType 的子類型 / Subtype of IFindRootReturnType
 * @param {T} rootData - 要檢查的根目錄資料 / Root data to check
 * @throws {RangeError} 當前目錄為 workspace 根目錄時 / When current directory is workspace root
 */
export function assertNotWorkspacesRoot<T extends IFindRootReturnType>(rootData: T): asserts rootData is T & {
	isWorkspace: false
}
{
	// 若存在 workspace 配置，檢查是否為 workspace 根目錄
	// If workspace configuration exists, check if it's workspace root
	if (rootData.hasWorkspace === true)
	{
		if (rootData.isWorkspace === true)
		{
			throw errcode(new RangeError(`cwd should not as workspaces root`), {
				rootData,
			})
		}
	}
}

/**
 * 斷言當前目錄位於 workspace 內但不是 workspace 根目錄
 * Assert that current directory is inside workspace but not workspace root
 *
 * 組合 assertHasWorkspaces 和 assertNotWorkspacesRoot 的檢查。
 * Combines checks from assertHasWorkspaces and assertNotWorkspacesRoot.
 *
 * @template T - IFindRootReturnType 的子類型 / Subtype of IFindRootReturnType
 * @param {T} rootData - 要檢查的根目錄資料 / Root data to check
 * @throws {RangeError} 當不在 workspace 內或為 workspace 根目錄時 / When not inside workspace or is workspace root
 */
export function assertHasAndNotWorkspacesRoot<T extends IFindRootReturnType>(rootData: T): asserts rootData is T & {
	hasWorkspace: true,
	isWorkspace: false,
}
{
	// 執行兩個斷言檢查
	// Execute both assertion checks
	assertHasWorkspaces(rootData)
	assertNotWorkspacesRoot(rootData)
}

// 匯出路徑處理工具函數
// Export path utility functions
export { pathNormalize, pathEqual }

/**
 * 列出符合指定路徑的 workspace 模式
 * List workspace patterns that match the specified path
 *
 * 此函數會分析 workspace 根目錄的 workspaces 配置，
 * This function analyzes the workspaces configuration of the workspace root,
 * 找出所有符合指定套件路徑的 glob 模式。
 * finding all glob patterns that match the specified package path.
 *
 * @param {string} ws - Workspace 根目錄路徑 / Workspace root directory path
 * @param {string} pkg - 套件目錄路徑 / Package directory path
 * @returns {string[]} 符合的 workspace 模式陣列 / Array of matching workspace patterns
 * @throws {RangeError} 當 ws 不是有效的 workspace 根目錄時 / When ws is not a valid workspace root
 * @throws {RangeError} 當 pkg 與 ws 相同時 / When pkg is the same as ws
 *
 * @example
 * const patterns = listMatchedPatternByPath('/workspace/root', '/workspace/root/packages/pkg-a');
 * // 可能返回 ['packages/*'] / Might return ['packages/*']
 */
export function listMatchedPatternByPath(ws: string, pkg: string)
{
	// 讀取 workspace 根目錄的 package.json
	// Read package.json from workspace root
	const manifest = readPackageJSON(ws);

	// 驗證是否為有效的 workspace 配置
	// Validate if it's a valid workspace configuration
	if (!manifest || !manifest.workspaces)
	{
		throw new RangeError(`not a package.json of yarn workspaces`)
	}

	// 提取 workspaces 配置
	// Extract workspaces configuration
	const workspaces = extractWorkspaces(manifest);

	// 計算從 workspace 根目錄到套件目錄的相對路徑
	// Calculate relative path from workspace root to package directory
	const relativePath = relative(ws, pkg);

	// 驗證 pkg 與 ws 不能相同
	// Validate that pkg and ws cannot be the same
	if (relativePath == '')
	{
		throw new RangeError(`pkg should not same as ws`)
	}

	// 將 workspaces 分類為忽略模式和一般模式
	// Categorize workspaces into ignore patterns and regular patterns
	const { ignores, list } = workspaces.reduce((a, b) =>
	{
		// 以 '!' 開頭的模式為忽略模式
		// Patterns starting with '!' are ignore patterns
		if (b.startsWith('!'))
		{
			a.ignores.push(b);
		}
		else
		{
			a.list.push(b);
		}

		return a;
	}, {
		ignores: [] as string[],
		list: [] as string[],
	});

	// 過濾出符合套件路徑的模式
	// Filter patterns that match the package path
	return list
		.reduce(function (a, b)
		{
			// 檢查相對路徑是否符合模式（包含忽略模式）
			// Check if relative path matches pattern (including ignore patterns)
			if (isMatchWorkspaces(relativePath, [
				b,
				...ignores,
			]))
			{
				a.push(b)
			}

			return a;
		}, [] as string[])
		;
}

export default findRoot
