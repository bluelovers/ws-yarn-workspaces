/**
 * Monorepo Workspace Root Directory Finder
 *
 * 此模組提供尋找 workspace 根目錄的進階功能，
 * 包含路徑驗證、錯誤處理和斷言函數。
 */

import { relative, normalize as pathNormalize } from 'upath2';
import {
	extractWorkspaces,
	isMatchWorkspaces,
	readPackageJSON,
	findWorkspaceRoot as findYarnWorkspaceRoot,
} from 'find-yarn-workspace-root2/core';
import errcode from 'err-code';
import { pathIsSame } from 'path-is-same';

import { sync as pkgDir } from 'pkg-dir';
import { ITSPickExtra } from 'ts-type/lib/type/record';

/**
 * findRoot 函數的返回類型
 *
 * 包含 workspace 相關的所有路徑資訊和狀態標記。
 */
export interface IFindRootReturnType
{
	/** Current working directory (the given input path) */
	cwd: string,
	/** Nearest package root directory found above cwd */
	pkg: string;
	/** Workspace root directory found from cwd */
	ws: string;
	/** Whether cwd is located inside a workspace */
	hasWorkspace: boolean;
	/** Whether the nearest package root is the workspace root */
	isWorkspace: boolean;
	/** Project root (workspace root if present, otherwise package root) */
	root: string;
	/** Whether the nearest package root is the project root */
	isRoot: boolean;
	/** Whether the nearest package root exists and is not the workspace root */
	isPkg: boolean;
}

/**
 * findRoot 函數的選項配置
 */
export interface IFindRootOptions
{
	/** 當前工作目錄 */
	cwd: string;
	/** 是否跳過 workspace 檢查 */
	skipCheckWorkspace?: boolean | string;
	/** 找不到時是否拋出錯誤 */
	throwError?: boolean;

	/** 是否要求必須位於 workspace */
	shouldHasWorkspaces?: boolean;
	/** 是否要求最近的套件根目錄不能是 workspace 根目錄 */
	shouldNotWorkspacesRoot?: boolean;
}

/**
 * 提供更方便的呼叫方式，選項參數皆為可選。
 *
 * @param {Partial<IFindRootOptions>} [options] - 選項配置（部分可選）
 * @param {boolean} [_throwError] - 是否在找不到時拋出錯誤
 * @returns {IFindRootReturnType|null} 根目錄資訊物件，若找不到則返回 null
 *
 * @example
 * const rootData = findRootLazy();
 * console.log(rootData?.root); // 專案根目錄
 */
export function findRootLazy(options?: Partial<IFindRootOptions>, _throwError?: boolean)
{
	options ??= {} as any;
	/** 若未提供 cwd，使用當前工作目錄 */
	options.cwd ??= process.cwd();

	return findRoot(options as IFindRootOptions, _throwError)
}

/**
 * 尋找 workspace 根目錄的核心函數
 *
 * 此函數會分析指定目錄，返回包含 workspace 相關資訊的完整物件。
 * 支援多種驗證選項和錯誤處理模式。
 *
 * @param {IFindRootOptions} options - 完整的選項配置
 * @param {boolean} [_throwError] - 是否在找不到時拋出錯誤
 * @returns {IFindRootReturnType|null} 根目錄資訊物件，若找不到則返回 null
 * @throws {RangeError} 當 options.cwd 為空或無效時
 * @throws {RangeError} 當同時啟用 shouldHasWorkspaces 和 skipCheckWorkspace 時
 * @throws {RangeError} 當找不到套件根目錄且啟用 throwError 時
 */
export function findRoot(options: IFindRootOptions, _throwError?: boolean): IFindRootReturnType
{
	/** 驗證 cwd 參數是否有效 */
	if (!options.cwd?.length)
	{
		throw new RangeError(`options.cwd is '${options.cwd}'`)
	}

	/** 標準化當前工作目錄路徑 */
	const cwd = pathNormalize(options.cwd);

	/** Workspace 根目錄路徑 */
	let ws: string;

	/** 若未跳過 workspace 檢查，尋找 workspace 根目錄 */
	if (!options.skipCheckWorkspace)
	{
		ws = findYarnWorkspaceRoot(cwd);
	}
	/** 若同時啟用 shouldHasWorkspaces 和 skipCheckWorkspace，拋出錯誤 */
	else if (options.shouldHasWorkspaces)
	{
		throw errcode(new RangeError(`shouldHasWorkspaces and skipCheckWorkspace should not enable at same time`), {
			options,
		})
	}

	/** 使用 pkg-dir 找出最近的套件根目錄 */
	let pkg = pkgDir(cwd);

	/** 取得 throwError 選項 */
	const { throwError = _throwError } = options;

	/** 若找不到套件根目錄且需要拋出錯誤 */
	if (pkg == null && (throwError || options.shouldHasWorkspaces))
	{
		const err = errcode(new RangeError(`can't found package root from target directory '${cwd}'`), {
			options,
		});
		throw err;
	}

	/** 標準化 workspace 根目錄路徑 */
	if (typeof ws === 'string')
	{
		ws = pathNormalize(ws);
	}

	/** 標準化套件根目錄路徑 */
	if (typeof pkg === 'string')
	{
		pkg = pathNormalize(pkg);
	}

	/** 將 null 轉換為 undefined 以保持一致性 */
	pkg ??= void 0;
	ws ??= void 0;

	/** 判斷 cwd 是否位於 workspace 內（有找到 workspace 根目錄） */
	const hasWorkspace = ws?.length > 0;
	/** 判斷最近的套件根目錄是否為 workspace 根目錄（比較 pkg 與 ws，非 cwd） */
	const isWorkspace = hasWorkspace && pathIsSame(ws, pkg);
	/** 決定專案根目錄（優先使用 workspace 根目錄，否則為最近的套件根目錄） */
	const root = hasWorkspace ? ws : pkg;
	/** 判斷最近的套件根目錄是否為專案根目錄（比較 pkg 與 root，非 cwd） */
	const isRoot = pathIsSame(root, pkg);
	/** 判斷最近的套件根目錄存在 且 不是 workspace 根目錄 */
	const isPkg = !isWorkspace && pkg?.length > 0;

	/** 若根目錄無效，返回 null */
	if (!root?.length)
	{
		return null;
	}

	/** 組裝返回結果物件 */
	const rootData = {
		cwd,
		pkg,
		ws,
		hasWorkspace,
		isWorkspace,
		root,
		isRoot,
		isPkg,
	} satisfies IFindRootReturnType;

	/** 若要求必須有 workspace 配置，執行斷言檢查 */
	if (options.shouldHasWorkspaces)
	{
		assertHasWorkspaces(rootData);
	}

	/** 若要求不能是 workspace 根目錄，執行斷言檢查 */
	if (options.shouldNotWorkspacesRoot)
	{
		assertNotWorkspacesRoot(rootData);
	}

	return rootData
}

/**
 * 建立虛擬的根目錄資料物件
 *
 * 此函數用於基於現有的 rootData 建立新的資料物件，
 * 可覆寫部分屬性並自動重新計算 isRoot 和 isWorkspace。
 *
 * @param {IFindRootReturnType} rootData - 原始的根目錄資料
 * @param {ITSPickExtra<IFindRootReturnType, 'pkg'>} input - 要覆寫的屬性
 * @returns {IFindRootReturnType} 新的根目錄資料物件
 *
 * @example
 * const newRootData = newFakeRootData(rootData, { pkg: '/new/pkg/path' });
 */
export function newFakeRootData(rootData: IFindRootReturnType, input: ITSPickExtra<IFindRootReturnType, 'pkg'>): IFindRootReturnType
{
	/** 計算是否為根目錄（若未提供則自動計算） */
	const isRoot = input.isRoot ?? pathIsSame(input.pkg, rootData.root);
	/** 計算是否為 workspace 根目錄（若未提供則自動計算） */
	const isWorkspace = input.isWorkspace ?? pathIsSame(input.pkg, rootData.ws);

	/** 合併原始資料和輸入資料 */
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
 *
 * 若 hasWorkspace 不為 true，則拋出錯誤。
 *
 * @template T - IFindRootReturnType 的子類型
 * @param {T} rootData - 要檢查的根目錄資料
 * @throws {RangeError} 當不在 workspace 內時
 */
export function assertHasWorkspaces<T extends IFindRootReturnType>(rootData: T): asserts rootData is T & {
	hasWorkspace: true
}
{
	/** 檢查是否存在有效的套件路徑且 hasWorkspace 為 true */
	if (!rootData.pkg?.length || rootData.hasWorkspace !== true)
	{
		throw errcode(new RangeError(`cwd should inside of workspaces root`), {
			rootData,
		})
	}
}

/**
 * 斷言最近的套件根目錄不是 workspace 根目錄
 *
 * 若 isWorkspace 為 true，則拋出錯誤。
 *
 * @template T - IFindRootReturnType 的子類型
 * @param {T} rootData - 要檢查的根目錄資料
 * @throws {RangeError} 最近的套件根目錄為 workspace 根目錄時
 */
export function assertNotWorkspacesRoot<T extends IFindRootReturnType>(rootData: T): asserts rootData is T & {
	isWorkspace: false
}
{
	/** 若位於 workspace，檢查最近的套件根目錄是否為 workspace 根目錄 */
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
 * 斷言 cwd 位於 workspace 內，且最近的套件根目錄不是 workspace 根目錄
 *
 * 組合 assertHasWorkspaces 和 assertNotWorkspacesRoot 的檢查。
 *
 * @template T - IFindRootReturnType 的子類型
 * @param {T} rootData - 要檢查的根目錄資料
 * @throws {RangeError} 當不在 workspace 內或最近的套件根目錄為 workspace 根目錄時
 */
export function assertHasAndNotWorkspacesRoot<T extends IFindRootReturnType>(rootData: T): asserts rootData is T & {
	hasWorkspace: true,
	isWorkspace: false,
}
{
	/** 執行兩個斷言檢查 */
	assertHasWorkspaces(rootData)
	assertNotWorkspacesRoot(rootData)
}

/** 匯出路徑處理工具函數 */
export { pathNormalize, pathIsSame }

/**
 * 列出符合指定路徑的 workspace 模式
 *
 * 此函數會分析 workspace 根目錄的 workspaces 配置，
 * 找出所有符合指定套件路徑的 glob 模式。
 *
 * @param {string} ws - Workspace 根目錄路徑
 * @param {string} pkg - 套件目錄路徑
 * @returns {string[]} 符合的 workspace 模式陣列
 * @throws {RangeError} 當 ws 不是有效的 workspace 根目錄時
 * @throws {RangeError} 當 pkg 與 ws 相同時
 *
 * @example
 * const patterns = listMatchedPatternByPath('/workspace/root', '/workspace/root/packages/pkg-a');
 * // 可能返回 ['packages/*'] / Might return ['packages/*']
 */
export function listMatchedPatternByPath(ws: string, pkg: string)
{
	/** 讀取 workspace 根目錄的 package.json */
	const manifest = readPackageJSON(ws);

	/** 驗證是否為有效的 workspace 配置 */
	if (!manifest || !manifest.workspaces)
	{
		throw new RangeError(`not a package.json of yarn workspaces`)
	}

	/** 提取 workspaces 配置 */
	const workspaces = extractWorkspaces(manifest);

	/** 計算從 workspace 根目錄到套件目錄的相對路徑 */
	const relativePath = relative(ws, pkg);

	/** 驗證 pkg 與 ws 不能相同 */
	if (relativePath == '')
	{
		throw new RangeError(`pkg should not same as ws`)
	}

	/** 將 workspaces 分類為忽略模式和一般模式 */
	const { ignores, list } = workspaces.reduce((a, b) =>
	{
		/** 以 '!' 開頭的模式為忽略模式 */
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

	/** 過濾出符合套件路徑的模式 */
	return list
		.reduce(function (a, b)
		{
			/** 檢查相對路徑是否符合模式（包含忽略模式） */
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
