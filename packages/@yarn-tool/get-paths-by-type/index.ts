import { npm, yarn, pnpm } from '@yarn-tool/get-global-dirs';
import { detectFnmByAll } from '@yarn-tool/fnm-detect';
import { join } from 'path';
import { ITSArrayListMaybeReadonly, ITSValueOrArrayMaybeReadonly } from 'ts-type';

/**
 * 當前目錄的 Symbol
 * Symbol for current directory
 */
const SymbolCurrentDirectory = Symbol.for('cwd');

/**
 * 全域路徑的 Symbol（包含 Yarn 和 Npm）
 * Symbol for global paths (includes both Yarn and Npm)
 */
const SymbolGlobal = Symbol.for('global');

/**
 * 全域 Npm 路徑的 Symbol
 * Symbol for global Npm path
 */
const SymbolGlobalNpm = Symbol.for('npm');

/**
 * 全域 Yarn 路徑的 Symbol
 * Symbol for global Yarn path
 */
const SymbolGlobalYarn = Symbol.for('yarn');

/**
 * 全域 Pnpm 路徑的 Symbol
 * Symbol for global Pnpm path
 */
const SymbolGlobalPnpm = Symbol.for('pnpm');

/**
 * 主模組路徑的 Symbol
 * Symbol for main module path
 */
const SymbolModuleMain = Symbol.for('module.main');

export {
	SymbolCurrentDirectory,
	SymbolGlobal,
	SymbolGlobalNpm,
	SymbolGlobalYarn,
	SymbolGlobalPnpm,
	SymbolModuleMain,
}

/**
 * 路徑類型定義
 * Path type definition
 */
export type IPathItem =
	typeof SymbolCurrentDirectory
	| typeof SymbolGlobal
	| typeof SymbolGlobalNpm
	| typeof SymbolGlobalYarn
	| typeof SymbolGlobalPnpm
	| typeof SymbolModuleMain
;

export type IPathItemInput = IPathItem | string;
export type IPathItemInputArray = ITSValueOrArrayMaybeReadonly<IPathItemInput>;

/**
 * Symbol 類型陣列
 * Array of Symbol types
 *
 * @example const validSymbols = getValidPathSymbols();
 */
export function getValidPathSymbols(): IPathItem[]
{
	return [
		SymbolGlobalPnpm,
		SymbolGlobalYarn,
		SymbolGlobalNpm,
		SymbolCurrentDirectory,
		SymbolModuleMain,
		SymbolGlobal,
	]
}

/**
 * Symbol 類型陣列，用於驗證 includeGlobal 陣列中的元素
 * Array of Symbol types for validation in includeGlobal array
 */
const validSymbols = getValidPathSymbols();

/**
 * 檢查值是否為有效的 Symbol 路徑類型
 * Check if value is a valid Symbol path type
 *
 * @param value - 要檢查的值 / Value to check
 * @returns 是否為有效的 Symbol / Whether it's a valid Symbol
 */
export function isValidPathSymbol(value: unknown): value is IPathItem
{
	return validSymbols.includes(value as IPathItem);
}

/**
 * 根據類型 Symbol 取得對應的路徑陣列
 * Get corresponding path array based on type Symbol
 *
 * 此函數根據傳入的 Symbol 類型返回相應的路徑：
 * This function returns corresponding paths based on the Symbol type:
 *
 * - `SymbolCurrentDirectory` - 當前工作目錄 / Current working directory
 * - `SymbolGlobal` - 全域 Yarn + Npm 套件目錄 / Global Yarn + Npm package directories
 * - `SymbolGlobalNpm` - 全域 Npm 套件目錄 / Global Npm package directory
 * - `SymbolGlobalYarn` - 全域 Yarn 套件目錄 / Global Yarn package directory
 * - `SymbolModuleMain` - 主模組的路徑 / Main module path
 *
 * @param valueType - 路徑類型 Symbol / Path type Symbol
 * @param cwd - 工作目錄（用於 SymbolCurrentDirectory）/ Working directory (for SymbolCurrentDirectory)
 * @returns 對應的路徑陣列 / Corresponding path array
 * @throws TypeError 當傳入不支援的類型時 / When an unsupported type is passed
 */
export function getPathsByType(valueType: IPathItem, cwd?: string)
{
	const paths: string[] = [];

	switch (valueType)
	{
		case SymbolGlobal:
			// 全域路徑：同時包含 Yarn 和 Npm 的套件目錄
			// Global paths: includes both Yarn and Npm package directories
			paths.push(...getPathsByType(SymbolGlobalPnpm, cwd));
			paths.push(yarn.packages);
			// paths.push(npm.packages)
			// break;
		case SymbolGlobalNpm:
			// 全域 Npm 套件目錄 / Global Npm package directory
			paths.push(npm.packages)

			let detectFnmByAllResult = detectFnmByAll();

			if (detectFnmByAllResult.isFnm)
			{
				paths.push(join(detectFnmByAllResult.fnmPath, 'node_modules'));
			}

			break;
		case SymbolCurrentDirectory:
			// 當前目錄：使用傳入的 cwd 或 process.cwd()
			// Current directory: use provided cwd or process.cwd()
			paths.push(cwd ?? process.cwd())
			break;
		case SymbolGlobalYarn:
			// 全域 Yarn 套件目錄 / Global Yarn package directory
			paths.push(yarn.packages)
			break;
		case SymbolGlobalPnpm:
			// 全域 Pnpm 套件目錄 / Global Pnpm package directory
			paths.push(pnpm.packages);
			/**
			 * 修正 sindresorhus/global-directory 的 BUG
			 */
			pnpm.prefix && paths.push(join(pnpm.prefix, 'store', '5\\node_modules'));
			break;
		case SymbolModuleMain:
			// 主模組路徑：若存在且非當前模組 / Main module path: if exists and not current module
			if (typeof module !== 'undefined' && require.main !== module)
			{
				paths.push(require.main.path)
			}
			break;
		default:
			throw new TypeError(`Not supported type: ${valueType}`)
	}

	return paths
}

export function getPathsByTypeLazy(valueType: IPathItemInputArray, cwd?: string)
{
	const result = (Array.isArray(valueType) ? valueType : [valueType] as IPathItemInput[]).reduce((result, valueType) => {

		if (typeof valueType === 'string')
		{
			if (!valueType.length)
			{
				throw new TypeError(`Invalid value: ${JSON.stringify(valueType)}`);
			}

			result.push(valueType);
		}
		else if (valueType ?? false)
		{
			const list = getPathsByType(valueType, cwd);

			if (list.length)
			{
				result.push(...list);
			}
		}

		return result;
	}, [] as string[])

	return result;
}

export default getPathsByType
