import _ from 'lodash';
import { ITSAsyncGenerator, ITSGenerator, ITSTypeAndStringLiteral, ITSArrayListMaybeReadonly } from 'ts-type';
import which, { sync as whichSync } from 'which';

/**
 * 支援的套件管理器類型
 * Supported package manager types
 */
export const enum EnumPackageManager
{
	'yarn' = 'yarn',
	'npm' = 'npm',
	'pnpm' = 'pnpm',
};

/**
 * 支援的套件管理器類型
 * Supported package manager types
 */
export type IPackageManager = ITSTypeAndStringLiteral<EnumPackageManager>;
/**
 * 支援的套件管理器型別，並允許擴充額外的自訂字串
 * Supported package manager type, extended with extra custom string literals
 *
 * @typeParam T - 額外允許的自訂型別 / Additional custom literal type allowed
 */
export type IPackageManager2<T extends string> = IPackageManager | T;

/**
 * 預設的套件管理器優先順序
 * Default package manager priority order
 */
const defaultClients: readonly IPackageManager[] = [EnumPackageManager.pnpm, EnumPackageManager.yarn, EnumPackageManager.npm];

/**
 * 偵測結果類型 - 包含套件管理器名稱和命令路徑
 * Detection result type - contains package manager name and command path
 *
 * @typeParam T - 套件管理器類型 / Package manager type
 */
export type IResultDetectPackageManagerRaw<T extends IPackageManager = IPackageManager> = IResultDetectRawCore<T>;

/**
 * 偵測結果核心類型 - 元組 [名稱, 路徑?]
 * Detection result core type - tuple [name, path?]
 *
 * @typeParam T - 字串類型 / String type
 */
export type IResultDetectRawCore<T extends string = IPackageManager> = readonly [T, string?];

/**
 * which 命令選項配置
 * which command options configuration
 */
const _whichOptions: which.Options = {
	nothrow: true,
}

/**
 * 選項配置介面
 * Options configuration interface
 */
export interface IOptionsWhichPackageManager
{
	/**
	 * 當找不到時是否返回預設值
	 * Whether to return default when not found
	 */
	returnDefault?: boolean;
	/**
	 * 只使用使用者指定的套件管理器
	 * 不合併使用者指定的優先順序與預設順序
	 * Only use user-specified package managers
	 * Do not merge user-specified priority with default order
	 */
	noUseDefaultClients?: boolean;
}

/**
 * 選項輸入類型 - 可接受布林值或選項物件
 * Options input type - accepts boolean or options object
 */
export type IRuntimeOptionInput = boolean | IOptionsWhichPackageManager;

/**
 * 核心選項處理函數 - 將輸入轉換為標準選項物件
 * Core options handler function - converts input to standard options object
 *
 * @param returnDefaultOrOptions - 布林值或選項物件 / Boolean or options object
 * @returns 標準選項物件 / Standard options object
 */
export function _handleOptionsWhichPackageManagerCore(returnDefaultOrOptions?: IRuntimeOptionInput): IOptionsWhichPackageManager
{
	if (typeof returnDefaultOrOptions === 'boolean')
	{
		/**
		 * 布林值是 `returnDefault` 的簡寫形式，
		 * 正規化成物件後，後續程式只需處理單一型別
		 * A boolean is shorthand for `returnDefault`;
		 * normalizing to an object keeps downstream code single-typed
		 */
		returnDefaultOrOptions = {
			returnDefault: returnDefaultOrOptions,
		}
	}

	/**
	 * 未傳入任何選項時以空物件代替 undefined，
	 * 讓呼叫端不必額外處理 null/undefined 分支
	 * When no option is given, return an empty object instead of undefined
	 * so callers never have to handle a null/undefined branch
	 */
	return returnDefaultOrOptions ?? {};
}

/**
 * 處理套件管理器選項與客戶端列表
 * Handle package manager options and client list
 *
 * @param npmClients - 套件管理器列表 / Package manager list
 * @param returnDefaultOrOptions - 選項輸入 / Options input
 * @returns 包含選項與檢查列表的物件 / Object containing options and check list
 */
export function handleOptionsWhichPackageManager<T extends string = IPackageManager>(npmClients?: ITSArrayListMaybeReadonly<IPackageManager2<T>> | undefined, returnDefaultOrOptions?: IRuntimeOptionInput)
{
	returnDefaultOrOptions = _handleOptionsWhichPackageManagerCore(returnDefaultOrOptions);

	return {
		options: returnDefaultOrOptions,
		/**
		 * 合併使用者指定的優先順序與預設順序
		 * Merge user-specified priority with default order
		 */
		clientsToCheck: _handleClientsToCheck<T>(npmClients as T[], returnDefaultOrOptions),
	};
}

/**
 * 合併使用者指定的優先順序與預設順序
 * Merge user-specified priority with default order
 */
export function _handleClientsToCheck<T extends string = IPackageManager>(npmClients?: ITSArrayListMaybeReadonly<T> | undefined, options?: IOptionsWhichPackageManager): readonly IPackageManager2<T>[]
{
	/**
	 * 合併使用者指定的優先順序與預設順序
	 * Merge user-specified priority with default order
	 */
	if (npmClients?.length)
	{
		/**
		 * 過濾不合法的名稱（空字串或 undefined）
		 * Filter out invalid names (empty string or undefined)
		 */
		npmClients = npmClients.filter(v => v?.length);

		/**
		 * `noUseDefaultClients` 時只保留使用者清單，否則追加預設順序；
		 * 以 Set 去重，避免使用者重複指定同一個套件管理器時重複檢查
		 * With `noUseDefaultClients` only the user list is kept, otherwise the
		 * default order is appended; Set de-duplicates so an entry specified
		 * twice by the user is not checked twice
		 */
		return options?.noUseDefaultClients
			? [...new Set([...npmClients])]
			: [...new Set([...npmClients, ...defaultClients])];
	}

	/**
	 * 使用者未指定任何套件管理器（或清單經篩選後為空）時，
	 * 直接以預設優先順序作為檢查清單
	 * When the user specified nothing (or the list became empty after filtering),
	 * fall back to the default priority order as the check list
	 */
	return [...defaultClients];
}

/**
 * 非同步生成器 - 使用 which 依序檢查套件管理器列表
 * Async generator - sequentially check package managers using which
 *
 * @param npmClients - 套件管理器列表 / Package manager list
 * @param returnDefaultOrOptions - 選項輸入 (布林值或 IOptionsWhichPackageManager) / Options input (boolean or IOptionsWhichPackageManager)
 * @yield - 可用的套件管理器元組 [名稱, 路徑] / Available package manager tuple [name, path]
 */
// @ts-ignore
export async function* _whichPackageManagerAsyncGenerator<T extends string = IPackageManager>(npmClients?: ITSArrayListMaybeReadonly<IPackageManager2<T>> | undefined, returnDefaultOrOptions?: IRuntimeOptionInput): ITSAsyncGenerator<IResultDetectPackageManagerRaw<IPackageManager2<T>>>
{

	const { clientsToCheck, options } = handleOptionsWhichPackageManager(npmClients, returnDefaultOrOptions);

	yield* _whichAsyncGeneratorCore(clientsToCheck, options) as any;
}

/**
 * 非同步生成器核心實作 - 依序檢查每個套件管理器是否可用
 * Async generator core implementation - sequentially check each package manager for availability
 *
 * @typeParam T - 套件管理器類型 / Package manager type
 * @param clientsToCheck - 要檢查的套件管理器列表 / List of package managers to check
 * @param options - 選項 / Options
 * @yield - 可用的套件管理器元組 [名稱, 路徑] / Available package manager tuple [name, path]
 */
export async function* _whichAsyncGeneratorCore<T extends string = IPackageManager>(clientsToCheck: ITSArrayListMaybeReadonly<T>, options: IOptionsWhichPackageManager): ITSAsyncGenerator<IResultDetectRawCore<T>>
{
	/**
	 * 追蹤是否會有任何套件管理器被找到，
	 * 供最後判斷是否需要回傳預設值
	 * Tracks whether any package manager was found,
	 * used at the end to decide if the default should be returned
	 */
	let notFound = true;

	/**
	 * 依序檢查每個套件管理器是否可用
	 * Check each package manager sequentially for availability
	 */
	for (const client of clientsToCheck)
	{
		/**
		 * `nothrow: true` 使找不到命令時回傳 null 而非丟出例外，
		 * `.catch(() => null)` 則涵蓋其他非預期錯誤，讓檢查能繼續下一個候選者
		 * `nothrow: true` makes a missing command resolve to null instead of throwing,
		 * and `.catch(() => null)` swallows unexpected errors so checking continues to the next candidate
		 */
		const commandPath = await which(client, _whichOptions).catch(() => null);
		/**
		 * 只有找到可執行檔時才 yield，避免把不存在的套件管理器當成可用結果
		 * Only yield when the executable exists, so missing package managers are never reported as available
		 */
		if (commandPath)
		{
			yield [client, commandPath as string] as IResultDetectRawCore<T>;
			notFound = false;
		}
	}

	/**
	 * 全部都找不到時，若允許回傳預設值，
	 * 則以檢查清單的第一個作為回報（即使它並未安裝）
	 * When nothing was found, if defaults are allowed, report the first
	 * entry of the check list (even if it is not installed)
	 */
	if (options.returnDefault && notFound) return [clientsToCheck[0]] as IResultDetectRawCore<T>;
}

/**
 * 使用 which 依序檢查套件管理器列表，返回第一個可用的
 * Sequentially check package managers using which, return the first available one
 *
 * @param npmClients - 套件管理器列表 / Package manager list
 * @returns 可用的套件管理器名稱 / Available package manager name
 */
export async function whichPackageManagerAsync(npmClients?: ITSArrayListMaybeReadonly<IPackageManager> | undefined, returnDefaultOrOptions?: IRuntimeOptionInput): Promise<IPackageManager>
{
	/**
	 * 只取生成器第一次 yield 的結果，
	 * 找不到時 `next.value` 為 undefined，回傳 undefined
	 * Take only the first value yielded by the generator;
	 * when nothing is found `next.value` is undefined, so undefined is returned
	 */
	return _whichPackageManagerAsyncGenerator(npmClients, returnDefaultOrOptions).next().then(next => next.value?.[0]);
}

/**
 * 使用 which 依序檢查套件管理器列表，返回所有可用的套件管理器陣列
 * Sequentially check package managers using which, return all available package managers as array
 *
 * @param npmClients - 套件管理器列表 / Package manager list
 * @returns 所有可用的套件管理器陣列 / Array of all available package managers
 */
export async function whichPackageManagerAsyncAll(npmClients?: ITSArrayListMaybeReadonly<IPackageManager> | undefined, returnDefaultOrOptions?: IRuntimeOptionInput): Promise<IPackageManager[]>
{
	const result: IPackageManager[] = [];

	/**
	 * 逐一收集生成器 yield 的結果，只保留名稱、捨棄路徑
	 * Collect each value yielded by the generator, keeping only the name and discarding the path
	 */
	for await (const client of _whichPackageManagerAsyncGenerator(npmClients, returnDefaultOrOptions))
	{
		result.push(client[0]);
	}

	return result;
}

/**
 * 同步生成器 - 使用 which 依序檢查套件管理器列表
 * Sync generator - sequentially check package managers using which
 *
 * @param npmClients - 套件管理器列表 / Package manager list
 * @param returnDefaultOrOptions - 選項輸入 (布林值或 IOptionsWhichPackageManager) / Options input (boolean or IOptionsWhichPackageManager)
 * @yield - 可用的套件管理器元組 [名稱, 路徑] / Available package manager tuple [name, path]
 */
// @ts-ignore
export function* _whichPackageManagerSyncGenerator<T extends string = IPackageManager>(npmClients?: ITSArrayListMaybeReadonly<IPackageManager2<T>> | undefined, returnDefaultOrOptions?: IRuntimeOptionInput): ITSGenerator<IResultDetectPackageManagerRaw<IPackageManager2<T>>>
{
	const { clientsToCheck, options } = handleOptionsWhichPackageManager(npmClients, returnDefaultOrOptions);

	yield* _whichSyncGeneratorCore(clientsToCheck, options) as any;
}

/**
 * 同步生成器核心實作 - 依序檢查每個套件管理器是否可用
 * Sync generator core implementation - sequentially check each package manager for availability
 *
 * @typeParam T - 套件管理器類型 / Package manager type
 * @param clientsToCheck - 要檢查的套件管理器列表 / List of package managers to check
 * @param options - 選項 / Options
 * @yield - 可用的套件管理器元組 [名稱, 路徑] / Available package manager tuple [name, path]
 */
export function* _whichSyncGeneratorCore<T extends string = IPackageManager>(clientsToCheck: ITSArrayListMaybeReadonly<T>, options: IOptionsWhichPackageManager): ITSGenerator<IResultDetectRawCore<T>>
{
	/**
	 * 追蹤是否會有任何套件管理器被找到，
	 * 供最後判斷是否需要回傳預設值
	 * Tracks whether any package manager was found,
	 * used at the end to decide if the default should be returned
	 */
	let notFound = true;

	/**
	 * 依序檢查每個套件管理器是否可用
	 * Check each package manager sequentially for availability
	 */
	for (const client of clientsToCheck)
	{
		/**
		 * `nothrow: true` 使找不到命令時回傳 null 而非丟出例外，
		 * 因此可直接以 truthy 判斷是否找到可執行檔
		 * `nothrow: true` makes a missing command return null instead of throwing,
		 * so a simple truthy check tells us whether the executable was found
		 */
		const commandPath = whichSync(client, _whichOptions);
		/**
		 * 只有找到可執行檔時才 yield，避免把不存在的套件管理器當成可用結果
		 * Only yield when the executable exists, so missing package managers are never reported as available
		 */
		if (commandPath)
		{
			yield [client, commandPath as string] as IResultDetectRawCore<T>;
			notFound = false;
		}
	}

	/**
	 * 全部都找不到時，若允許回傳預設值，
	 * 則以檢查清單的第一個作為回報（即使它並未安裝）
	 * When nothing was found, if defaults are allowed, report the first
	 * entry of the check list (even if it is not installed)
	 */
	if (options.returnDefault && notFound) return [clientsToCheck[0]] as IResultDetectRawCore<T>;
}

/**
 * 使用 which 依序檢查套件管理器列表，返回所有可用的套件管理器陣列（同步版本）
 * Sequentially check package managers using which, return all available package managers as array (sync version)
 *
 * @param npmClients - 套件管理器列表 / Package manager list
 * @returns 所有可用的套件管理器陣列 / Array of all available package managers
 */
export function whichPackageManagerSyncAll(npmClients?: ITSArrayListMaybeReadonly<IPackageManager> | undefined, returnDefaultOrOptions?: IRuntimeOptionInput): IPackageManager[]
{
	const result: IPackageManager[] = [];

	/**
	 * 逐一收集生成器 yield 的結果，只保留名稱、捨棄路徑
	 * Collect each value yielded by the generator, keeping only the name and discarding the path
	 */
	for (const client of _whichPackageManagerSyncGenerator(npmClients, returnDefaultOrOptions))
	{
		result.push(client[0]);
	}

	return result;
}

/**
 * 使用 which 依序檢查套件管理器列表，返回第一個可用的
 * Sequentially check package managers using which, return the first available one
 *
 * @param npmClients - 套件管理器列表 / Package manager list
 * @returns 可用的套件管理器名稱 / Available package manager name
 */
export function whichPackageManagerSync(npmClients?: ITSArrayListMaybeReadonly<IPackageManager> | undefined, returnDefaultOrOptions?: IRuntimeOptionInput): IPackageManager
{
	/**
	 * 只取生成器第一次 yield 的結果，
	 * 找不到時 `next.value` 為 undefined，回傳 undefined
	 * Take only the first value yielded by the generator;
	 * when nothing is found `next.value` is undefined, so undefined is returned
	 */
	return _whichPackageManagerSyncGenerator(npmClients, returnDefaultOrOptions).next().value?.[0]
}

/**
 * 預設匯出：同步偵測第一個可用的套件管理器
 * Default export: synchronously detect the first available package manager
 */
export default whichPackageManagerSync
