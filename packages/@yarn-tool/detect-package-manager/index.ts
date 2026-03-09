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
		returnDefaultOrOptions = {
			returnDefault: returnDefaultOrOptions,
		}
	}

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
export function handleOptionsWhichPackageManager(npmClients?: ITSArrayListMaybeReadonly<IPackageManager> | undefined, returnDefaultOrOptions?: IRuntimeOptionInput)
{
	returnDefaultOrOptions = _handleOptionsWhichPackageManagerCore(returnDefaultOrOptions);

	return {
		options: returnDefaultOrOptions,
		/**
		 * 合併使用者指定的優先順序與預設順序
		 * Merge user-specified priority with default order
		 */
		clientsToCheck: _handleClientsToCheck(npmClients, returnDefaultOrOptions),
	};
}

/**
 * 合併使用者指定的優先順序與預設順序
 * Merge user-specified priority with default order
 */
export function _handleClientsToCheck(npmClients?: ITSArrayListMaybeReadonly<IPackageManager> | undefined, options?: IOptionsWhichPackageManager): readonly IPackageManager[]
{
	/**
	 * 合併使用者指定的優先順序與預設順序
	 * Merge user-specified priority with default order
	 */
	if (npmClients?.length)
	{
		return options?.noUseDefaultClients
			? [...new Set([...npmClients])]
			: [...new Set([...npmClients, ...defaultClients])];
	}

	return [...defaultClients];
}

/**
 * 使用 which 依序檢查套件管理器列表，返回第一個可用的
 * Sequentially check package managers using which, return the first available one
 *
 * @param npmClients - 套件管理器列表 / Package manager list
 * @returns 可用的套件管理器名稱 / Available package manager name
 */
/**
 * 非同步生成器 - 使用 which 依序檢查套件管理器列表
 * Async generator - sequentially check package managers using which
 *
 * @param npmClients - 套件管理器列表 / Package manager list
 * @param returnDefaultOrOptions - 選項輸入 (布林值或 IOptionsWhichPackageManager) / Options input (boolean or IOptionsWhichPackageManager)
 * @yield - 可用的套件管理器元組 [名稱, 路徑] / Available package manager tuple [name, path]
 */
// @ts-ignore
export async function* _whichPackageManagerAsyncGenerator(npmClients?: ITSArrayListMaybeReadonly<IPackageManager> | undefined, returnDefaultOrOptions?: IRuntimeOptionInput): ITSAsyncGenerator<IResultDetectPackageManagerRaw>
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
	let notFound = true;

	/**
	 * 依序檢查每個套件管理器是否可用
	 * Check each package manager sequentially for availability
	 */
	for (const client of clientsToCheck)
	{
		const commandPath = await which(client, _whichOptions).catch(() => null);
		if (commandPath)
		{
			yield [client, commandPath as string] as IResultDetectRawCore<T>;
			notFound = false;
		}
	}

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

	for await (const client of _whichPackageManagerAsyncGenerator(npmClients, returnDefaultOrOptions))
	{
		result.push(client[0]);
	}

	return result;
}

/**
 * 使用 which 依序檢查套件管理器列表，以同步生成器方式 yield 所有可用的套件管理器
 * Sequentially check package managers using which, yield all available package managers via sync generator
 *
 * @param npmClients - 套件管理器列表 / Package manager list
 * @returns 可用的套件管理器（透過 yield）/ Available package manager (via yield)
 */
/**
 * 同步生成器 - 使用 which 依序檢查套件管理器列表
 * Sync generator - sequentially check package managers using which
 *
 * @param npmClients - 套件管理器列表 / Package manager list
 * @param returnDefaultOrOptions - 選項輸入 (布林值或 IOptionsWhichPackageManager) / Options input (boolean or IOptionsWhichPackageManager)
 * @yield - 可用的套件管理器元組 [名稱, 路徑] / Available package manager tuple [name, path]
 */
// @ts-ignore
export function* _whichPackageManagerSyncGenerator(npmClients?: ITSArrayListMaybeReadonly<IPackageManager> | undefined, returnDefaultOrOptions?: IRuntimeOptionInput): ITSGenerator<IResultDetectPackageManagerRaw>
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
	let notFound = true;

	/**
	 * 依序檢查每個套件管理器是否可用
	 * Check each package manager sequentially for availability
	 */
	for (const client of clientsToCheck)
	{
		const commandPath = whichSync(client, _whichOptions);
		if (commandPath)
		{
			yield [client, commandPath as string] as IResultDetectRawCore<T>;
			notFound = false;
		}
	}

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
export function whichPackageManagerSync(npmClients?: ITSArrayListMaybeReadonly<IPackageManager> | undefined, returnDefaultOrOptions?: IRuntimeOptionInput)
{
	return _whichPackageManagerSyncGenerator(npmClients, returnDefaultOrOptions).next().value?.[0]
}

export default whichPackageManagerSync
