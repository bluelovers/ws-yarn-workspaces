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
/**
 * 匯出所有可用的路徑類型 Symbol，供外部做型別檢查或列舉使用
 * Exports all available path type Symbols for external type checking or enumeration
 */
export { SymbolCurrentDirectory, SymbolGlobal, SymbolGlobalNpm, SymbolGlobalYarn, SymbolGlobalPnpm, SymbolModuleMain, };
/**
 * 路徑類型定義
 * Path type definition
 */
export type IPathItem = typeof SymbolCurrentDirectory | typeof SymbolGlobal | typeof SymbolGlobalNpm | typeof SymbolGlobalYarn | typeof SymbolGlobalPnpm | typeof SymbolModuleMain;
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
 * - `SymbolGlobalPnpm` - 全域 Pnpm 套件目錄 / Global Pnpm package directory
 * - `SymbolModuleMain` - 主模組的路徑 / Main module path
 *
 * @param valueType - 路徑類型 Symbol / Path type Symbol
 * @param cwd - 工作目錄（用於 SymbolCurrentDirectory）/ Working directory (for SymbolCurrentDirectory)
 * @returns 對應的路徑陣列 / Corresponding path array
 * @throws TypeError 當傳入不支援的類型時 / When an unsupported type is passed
 */
export declare function getPathsByType(valueType: IPathItem, cwd?: string): string[];
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
export declare function getPathsByTypeLazy(valueType: IPathItemInputArray, cwd?: string): string[];
/**
 * 預設匯出 getPathsByType，方便只需單一 Symbol 查詢的呼叫端直接引入
 * Default-exports getPathsByType so callers that only need a single Symbol lookup can import it directly
 */
export default getPathsByType;
