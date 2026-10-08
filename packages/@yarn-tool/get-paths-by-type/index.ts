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

/**
 * 匯出所有可用的路徑類型 Symbol，供外部做型別檢查或列舉使用
 * Exports all available path type Symbols for external type checking or enumeration
 */
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

/**
 * 路徑類型輸入：單一路徑類型 Symbol 或任意路徑字串
 * Path type input: a single path type Symbol or an arbitrary path string
 */
export type IPathItemInput = IPathItem | string;

/**
 * 路徑類型輸入的陣列形態（允許唯讀陣列與單值）
 * Array form of path type input (allows readonly arrays and a single value)
 */
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
 * - `SymbolGlobalPnpm` - 全域 Pnpm 套件目錄 / Global Pnpm package directory
 * - `SymbolModuleMain` - 主模組的路徑 / Main module path
 *
 * @param valueType - 路徑類型 Symbol / Path type Symbol
 * @param cwd - 工作目錄（用於 SymbolCurrentDirectory）/ Working directory (for SymbolCurrentDirectory)
 * @returns 對應的路徑陣列 / Corresponding path array
 * @throws TypeError 當傳入不支援的類型時 / When an unsupported type is passed
 */
export function getPathsByType(valueType: IPathItem, cwd?: string)
{
	// 收集結果的緩衝陣列，各 case 依序 push，最後一次性回傳
	// Buffer array for results; each case pushes into it and it is returned once at the end
	const paths: string[] = [];

	switch (valueType)
	{
		case SymbolGlobal:
			// 全域路徑：同時包含 Yarn 和 Npm 的套件目錄
			// Global paths: includes both Yarn and Npm package directories
			// 此 case 故意不寫 break，會一路 fallthrough 到 SymbolGlobalNpm，
			// 以便在既有 Yarn/Pnpm 路徑之後再補上 Npm 路徑（下方被註解的 break 為舊版行為）
			// This case intentionally omits break and falls through to SymbolGlobalNpm,
			// so the Npm path is appended after the existing Yarn/Pnpm paths (the commented-out break is legacy behavior)
			paths.push(...getPathsByType(SymbolGlobalPnpm, cwd));
			paths.push(yarn.packages);
			// paths.push(npm.packages)
			// break;
		case SymbolGlobalNpm:
			// 全域 Npm 套件目錄 / Global Npm package directory
			paths.push(npm.packages)

			let detectFnmByAllResult = detectFnmByAll();

			// 使用 fnm 時其 node_modules 不在標準全域路徑下，需額外補上才能完整涵蓋
			// When fnm is used, its node_modules is not under the standard global path and must be added explicitly
			if (detectFnmByAllResult.isFnm)
			{
				paths.push(join(detectFnmByAllResult.fnmPath, 'node_modules'));
			}

			break;
		case SymbolCurrentDirectory:
			/** 當前目錄：使用傳入的 cwd 或 process.cwd() */
			paths.push(cwd ?? process.cwd())
			break;
		case SymbolGlobalYarn:
			/** 全域 Yarn 套件目錄 / Global Yarn package directory */
			paths.push(yarn.packages)
			break;
		case SymbolGlobalPnpm:
			/** 全域 Pnpm 套件目錄 / Global Pnpm package directory */
			paths.push(pnpm.packages);
			/**
			 * 修正 sindresorhus/global-directory 的 BUG (於 v11, v12 已無效，但仍保留此邏輯)
			 * @deprecated
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
		// 未註冊的型別直接拒絕，避免回傳空陣列造成呼叫端誤判為「無路徑」
		// Reject unregistered types outright so callers do not mistake an empty array for "no paths"
		default:
			throw new TypeError(`Not supported type: ${valueType}`)
	}

	return paths
}

/**
 * 延遲 (Lazy) 版本：一次解析多種路徑輸入並合併結果
 * Lazy version that resolves multiple path inputs at once and merges the results
 *
 * 可接受單一 Symbol、單一字串或兩者混合的陣列；
 * Accepts a single Symbol, a single string, or an array mixing both,
 * 字串輸入會直接當作路徑使用，Symbol 則交由 getPathsByType 解析。
 * string inputs are used as paths directly, while Symbols are resolved via getPathsByType.
 *
 * @param {IPathItemInputArray} valueType - 路徑類型 Symbol、路徑字串或其陣列 / Path type Symbol, path string, or an array of them
 * @param {string} [cwd] - 工作目錄（用於 SymbolCurrentDirectory）/ Working directory (for SymbolCurrentDirectory)
 * @returns {string[]} 合併後的路徑陣列（空白字串與空結果會被略過）/ Merged path array (empty strings and empty results are skipped)
 * @throws {TypeError} 當字串輸入為空字串時 / When a string input is an empty string
 */
export function getPathsByTypeLazy(valueType: IPathItemInputArray, cwd?: string)
{
	// 統一將單值正規化為陣列後逐一處理，避免呼叫端需自行判斷型別
	// Normalize a single value into an array first so callers do not need to branch on type
	const result = (Array.isArray(valueType) ? valueType : [valueType] as IPathItemInput[]).reduce((result, valueType) => {

		// 字串視為已知路徑直接採用，但空字串毫無意義，視為錯誤輸入
		// Strings are treated as known paths, but an empty string is meaningless and treated as invalid input
		if (typeof valueType === 'string')
		{
			if (!valueType.length)
			{
				throw new TypeError(`Invalid value: ${JSON.stringify(valueType)}`);
			}

			result.push(valueType);
		}
		// 僅在傳入有效值時查詢；查無結果（空陣列）則略過，避免產生空洞
		// Only look up when a valid value is given; skip empty results to avoid holes
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

/**
 * 預設匯出 getPathsByType，方便只需單一 Symbol 查詢的呼叫端直接引入
 * Default-exports getPathsByType so callers that only need a single Symbol lookup can import it directly
 */
export default getPathsByType
