import { ITSValueOrArrayMaybeReadonly } from 'ts-type';
/**
 * 當前目錄的 Symbol
 * Symbol for current directory
 */
declare const SymbolCurrentDirectory: unique symbol;
/**
 * 全域路徑的 Symbol（包含 Yarn 和 Npm）
 * Symbol for global paths (includes both Yarn and Npm)
 */
declare const SymbolGlobal: unique symbol;
/**
 * 全域 Npm 路徑的 Symbol
 * Symbol for global Npm path
 */
declare const SymbolGlobalNpm: unique symbol;
/**
 * 全域 Yarn 路徑的 Symbol
 * Symbol for global Yarn path
 */
declare const SymbolGlobalYarn: unique symbol;
/**
 * 全域 Pnpm 路徑的 Symbol
 * Symbol for global Pnpm path
 */
declare const SymbolGlobalPnpm: unique symbol;
/**
 * 主模組路徑的 Symbol
 * Symbol for main module path
 */
declare const SymbolModuleMain: unique symbol;
export { SymbolCurrentDirectory, SymbolGlobal, SymbolGlobalNpm, SymbolGlobalYarn, SymbolGlobalPnpm, SymbolModuleMain, };
/**
 * 路徑類型定義
 * Path type definition
 */
export type IPathItem = typeof SymbolCurrentDirectory | typeof SymbolGlobal | typeof SymbolGlobalNpm | typeof SymbolGlobalYarn | typeof SymbolGlobalPnpm | typeof SymbolModuleMain;
export type IPathItemInput = IPathItem | string;
export type IPathItemInputArray = ITSValueOrArrayMaybeReadonly<IPathItemInput>;
/**
 * Symbol 類型陣列
 * Array of Symbol types
 *
 * @example const validSymbols = getValidPathSymbols();
 */
export declare function getValidPathSymbols(): IPathItem[];
/**
 * 檢查值是否為有效的 Symbol 路徑類型
 * Check if value is a valid Symbol path type
 *
 * @param value - 要檢查的值 / Value to check
 * @returns 是否為有效的 Symbol / Whether it's a valid Symbol
 */
export declare function isValidPathSymbol(value: unknown): value is IPathItem;
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
export declare function getPathsByType(valueType: IPathItem, cwd?: string): string[];
export declare function getPathsByTypeLazy(valueType: IPathItemInputArray, cwd?: string): string[];
export default getPathsByType;
