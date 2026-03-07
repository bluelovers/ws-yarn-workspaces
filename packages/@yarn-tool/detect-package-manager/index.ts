import { ITSRequiredWith, ITSTypeAndStringLiteral } from 'ts-type';
import which, { sync as whichSync } from 'which';

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
 * 合併使用者指定的優先順序與預設順序
 * Merge user-specified priority with default order
 */
export function _handleClientsToCheck(npmClients?: IPackageManager[] | undefined): IPackageManager[]
{
	return npmClients?.length
		? [...new Set([...npmClients, ...defaultClients])]
		: defaultClients as IPackageManager[];
}

/**
 * 使用 which 依序檢查套件管理器列表，返回第一個可用的
 * Sequentially check package managers using which, return the first available one
 *
 * @param npmClients - 套件管理器列表 / Package manager list
 * @returns 可用的套件管理器名稱 / Available package manager name
 */
export async function whichPackageManagerAsync(npmClients: IPackageManager[] | undefined): Promise<IPackageManager>
{
	/**
	 * 合併使用者指定的優先順序與預設順序
	 * Merge user-specified priority with default order
	 */
	const clientsToCheck: IPackageManager[] = _handleClientsToCheck(npmClients);

	/**
	 * 依序檢查每個套件管理器是否可用
	 * Check each package manager sequentially for availability
	 */
	for (const client of clientsToCheck)
	{
		const commandPath = await which(client).catch(() => null);
		if (commandPath)
		{
			return client;
		}
	}

	return clientsToCheck[0];
}

/**
 * 使用 which 依序檢查套件管理器列表，返回第一個可用的
 * Sequentially check package managers using which, return the first available one
 *
 * @param npmClients - 套件管理器列表 / Package manager list
 * @returns 可用的套件管理器名稱 / Available package manager name
 */
export function whichPackageManagerSync(npmClients: IPackageManager[] | undefined): IPackageManager
{
	/**
	 * 合併使用者指定的優先順序與預設順序
	 * Merge user-specified priority with default order
	 */
	const clientsToCheck: IPackageManager[] = _handleClientsToCheck(npmClients);

	/**
	 * 依序檢查每個套件管理器是否可用
	 * Check each package manager sequentially for availability
	 */
	for (const client of clientsToCheck)
	{
		const commandPath = whichSync(client);
		if (commandPath)
		{
			return client;
		}
	}

	return clientsToCheck[0];
}

export default whichPackageManagerSync
