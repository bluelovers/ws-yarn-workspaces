/**
 * 向上搜尋工作區路徑的模組
 * Module for finding up paths in workspaces
 *
 * 此模組結合 find-up-paths 與 yarn workspaces 功能，
 * 提供在工作區環境中向上搜尋檔案或目錄的能力。
 * This module combines find-up-paths with yarn workspaces functionality,
 * providing the ability to search upward for files or directories in a workspace environment.
 */
import {
	findUpPaths,
	findUpPathsRuntime,
	findUpPathsRuntimeAsync,
	handleOptions as _handleOptions,
	IOptionsFindUpPaths,
	IRuntimeFindUpPaths,
} from 'find-up-paths';
import { findRoot, IFindRootReturnType } from '@yarn-tool/find-root';
import { pathParentsGeneratorRuntime } from 'path-parents';

/**
 * 工作區向上搜尋選項介面
 * Interface for workspace find-up options
 *
 * 擴展自 IOptionsFindUpPaths，新增工作區相關的選項。
 * Extends IOptionsFindUpPaths with workspace-specific options.
 */
export interface IOptionsFindUpPathsWorkspaces extends IOptionsFindUpPaths
{
	/**
	 * 是否忽略當前套件目錄
	 * Whether to ignore the current package directory
	 *
	 * 若設為 true 且當前不在 workspace 子目錄中，則從套件根目錄開始搜尋。
	 * If true and not in a workspace subdirectory, search starts from package root.
	 */
	ignoreCurrentPackage?: boolean,
	/**
	 * 是否從當前套件目錄開始搜尋
	 * Whether to start searching from the current package directory
	 *
	 * 若設為 true，則從套件根目錄開始向上搜尋。
	 * If true, search upward starts from the package root directory.
	 */
	startFromCurrentPackage?: boolean,
}

/**
 * 工作區向上搜尋執行時期介面
 * Interface for workspace find-up runtime
 *
 * 擴展自 IRuntimeFindUpPaths，包含工作區根目錄資訊。
 * Extends IRuntimeFindUpPaths with workspace root information.
 */
export interface IRuntimeFindUpPathsWorkspaces<OPTS extends IOptionsFindUpPathsWorkspaces = IOptionsFindUpPathsWorkspaces> extends IRuntimeFindUpPaths<OPTS>
{
	/**
	 * 工作區根目錄資訊
	 * Workspace root directory information
	 *
	 * 包含根目錄路徑、套件路徑及是否為 workspace 等資訊。
	 * Contains root path, package path, and whether it's a workspace.
	 */
	rootData: IFindRootReturnType
}

/**
 * 處理工作區向上搜尋的選項
 * Handle options for workspace find-up
 *
 * 整合 find-up-paths 與 find-root 功能，設定工作區相關的搜尋參數。
 * Integrates find-up-paths with find-root functionality to set up workspace search parameters.
 *
 * @template T - 選項類型，擴展自 IOptionsFindUpPathsWorkspaces
 * @param cwd - 當前工作目錄或選項物件 / Current working directory or options object
 * @param opts - 額外的選項 / Additional options
 * @returns 處理後的執行時期物件 / Processed runtime object
 */
export function handleOptions<T extends IOptionsFindUpPathsWorkspaces = IOptionsFindUpPathsWorkspaces>(cwd?: string | T,
	opts?: T,
): IRuntimeFindUpPathsWorkspaces<IOptionsFindUpPathsWorkspaces & T>
{
	// 使用 find-up-paths 的 handleOptions 初始化 runtime
	// Initialize runtime using find-up-paths handleOptions
	const runtime = _handleOptions(cwd, opts) as IRuntimeFindUpPathsWorkspaces<T>;

	// 使用 find-root 取得工作區根目錄資訊
	// Get workspace root information using find-root
	runtime.rootData = findRoot({
		cwd: runtime.cwd,
		throwError: true,
	});

	// 將根目錄加入停止路徑，避免搜尋超過工作區範圍
	// Add root to stop paths to prevent searching beyond workspace scope
	runtime.stopPath.push(runtime.rootData.root);

	// 處理 ignoreCurrentPackage 選項：若不在 workspace 中則從套件目錄開始
	// Handle ignoreCurrentPackage: if not in workspace, start from package directory
	if (runtime.opts.ignoreCurrentPackage && !runtime.rootData.isWorkspace)
	{
		runtime.cwd = runtime.rootData.pkg;
		runtime.opts.includeCurrentDirectory = false;
	}
	// 處理 startFromCurrentPackage 選項：從套件目錄開始搜尋
	// Handle startFromCurrentPackage: start searching from package directory
	else if (runtime.opts.startFromCurrentPackage)
	{
		runtime.cwd = runtime.rootData.pkg;
	}

	return runtime;
}

/**
 * 取得工作區中所有父層路徑
 * Get all parent paths in workspace
 *
 * 從當前目錄向上遍歷至工作區根目錄，返回所有父層路徑。
 * Traverses from current directory up to workspace root, returning all parent paths.
 *
 * @param cwd - 當前工作目錄或選項物件 / Current working directory or options object
 * @param opts - 額外的選項 / Additional options
 * @returns 父層路徑陣列 / Array of parent paths
 */
export function pathParentsWorkspaces(cwd?: string | IOptionsFindUpPathsWorkspaces,
	opts?: IOptionsFindUpPathsWorkspaces,
)
{
	const runtime = handleOptions(cwd, opts);
	// 使用 pathParentsGeneratorRuntime 產生所有父層路徑
	// Generate all parent paths using pathParentsGeneratorRuntime
	return [...pathParentsGeneratorRuntime(runtime)]
}

/**
 * 在工作區中向上搜尋符合條件的路徑（同步版本）
 * Find up paths matching pattern in workspace (synchronous version)
 *
 * 從當前目錄向上搜尋符合指定模式的第一個檔案或目錄。
 * Searches upward from current directory for the first file or directory matching the pattern.
 *
 * @param pattern - 要搜尋的檔案模式（字串或陣列）/ File pattern(s) to search for
 * @param opts - 搜尋選項 / Search options
 * @returns 包含 stat 和 result 的物件 / Object containing stat and result
 */
export function findUpPathsWorkspaces(pattern: string | string[], opts?: IOptionsFindUpPathsWorkspaces)
{
	const runtime = handleOptions(opts);

	console.dir(runtime)

	// 使用 findUpPathsRuntime 執行實際搜尋
	// Execute actual search using findUpPathsRuntime
	return findUpPaths(pattern, runtime)
}

/**
 * 在工作區中向上搜尋符合條件的路徑（非同步版本）
 * Find up paths matching pattern in workspace (asynchronous version)
 *
 * 非同步地從當前目錄向上搜尋符合指定模式的第一個檔案或目錄。
 * Asynchronously searches upward from current directory for the first file or directory matching the pattern.
 *
 * @param pattern - 要搜尋的檔案模式（字串或陣列）/ File pattern(s) to search for
 * @param opts - 搜尋選項 / Search options
 * @returns 包含 stat 和 result 的 Promise / Promise containing stat and result
 */
export function findUpPathsWorkspacesAsync(pattern: string | string[], opts?: IOptionsFindUpPathsWorkspaces)
{
	const runtime = handleOptions(opts);

	// 使用 findUpPathsRuntimeAsync 執行非同步搜尋
	// Execute asynchronous search using findUpPathsRuntimeAsync
	return findUpPathsRuntimeAsync(pattern, runtime)
}

// 預設匯出 findUpPathsWorkspaces 函數
// Default export of findUpPathsWorkspaces function
export default findUpPathsWorkspaces
