import type { IOptionsRequireResolve, IPackageCoreInfo, IPackageInfo } from './types';
import type { IPackageJson } from '@ts-type/package-dts';
/**
 * 解析套件的核心函數
 * Core function for package resolution
 *
 * 此函數嘗試解析模組的入口點位置，若失敗則改為解析 package.json 位置。
 * 支援擴充選項，可以使用 includeGlobal、includeCurrentDirectory 等功能。
 * This function attempts to resolve the module's entry point location,
 * falling back to package.json location if the first attempt fails.
 * Supports extended options like includeGlobal, includeCurrentDirectory, etc.
 *
 * @param moduleName - 要解析的模組名稱 / Module name to resolve
 * @param options - 解析選項 / Resolution options
 * @returns 包含模組名稱、套件根目錄和入口點位置的物件 / Object containing module name, package root, and entry point location
 *
 * @example
 * ```typescript
 * // 基本用法 / Basic usage
 * const info = resolvePackageCore('jest');
 * console.log(info.name);        // 'jest'
 * console.log(info.pkgRoot);     // '/path/to/node_modules/jest'
 * console.log(info.entryPointLocation); // '/path/to/node_modules/jest/build/index.js'
 *
 * // 使用全域路徑 / With global paths
 * const info = resolvePackageCore('typescript', {
 *   includeGlobal: true,
 * });
 *
 * // 使用當前目錄 / With current directory
 * const info = resolvePackageCore('my-module', {
 *   includeCurrentDirectory: true,
 *   cwd: process.cwd(),
 * });
 * ```
 */
export declare function resolvePackageCore(moduleName: string, options?: IOptionsRequireResolve): IPackageCoreInfo;
/**
 * 解析並取得套件的根目錄路徑
 * Resolve and get the package root directory path
 *
 * @param moduleName - 要解析的模組名稱 / Module name to resolve
 * @param options - 解析選項 / Resolution options
 * @returns 套件根目錄的絕對路徑 / Absolute path to the package root directory
 *
 * @example
 * ```typescript
 * const root = resolvePackageRoot('jest');
 * // '/path/to/node_modules/jest'
 *
 * // 使用全域路徑 / With global paths
 * const root = resolvePackageRoot('typescript', {
 *   includeGlobal: true,
 * });
 * ```
 */
export declare function resolvePackageRoot(moduleName: string, options?: IOptionsRequireResolve): string;
/**
 * 解析並取得套件的 package.json 檔案位置
 * Resolve and get the package.json file location
 *
 * @param moduleName - 要解析的模組名稱 / Module name to resolve
 * @param options - 解析選項 / Resolution options
 * @returns package.json 檔案的絕對路徑 / Absolute path to the package.json file
 *
 * @example
 * ```typescript
 * const pkgPath = resolvePackageJsonLocation('jest');
 * // '/path/to/node_modules/jest/package.json'
 *
 * // 使用全域路徑 / With global paths
 * const pkgPath = resolvePackageJsonLocation('typescript', {
 *   includeGlobal: true,
 * });
 * ```
 */
export declare function resolvePackageJsonLocation(moduleName: string, options?: IOptionsRequireResolve): string;
/**
 * 建立一個相對於套件根目錄解析路徑的函數
 * Create a function that resolves paths relative to the package root
 *
 * @param moduleName - 要解析的模組名稱 / Module name to resolve
 * @param options - 解析選項 / Resolution options
 * @returns 接受路徑參數並返回絕對路徑的函數 / Function that accepts path arguments and returns absolute paths
 *
 * @example
 * ```typescript
 * const resolveInJest = createResolveLocationFn('jest');
 * const cliPath = resolveInJest('build', 'cli', 'index.js');
 * // '/path/to/node_modules/jest/build/cli/index.js'
 *
 * // 使用全域路徑 / With global paths
 * const resolveInTs = createResolveLocationFn('typescript', {
 *   includeGlobal: true,
 * });
 * ```
 */
export declare function createResolveLocationFn(moduleName: string, options?: IOptionsRequireResolve): (path: string, ...paths: string[]) => string;
/**
 * 讀取模組的 package.json 內容
 * Read the module's package.json content
 *
 * @typeParam P - package.json 的類型，預設為 IPackageJson / Type of package.json, defaults to IPackageJson
 * @param moduleName - 要讀取的模組名稱 / Module name to read
 * @param options - 解析選項 / Resolution options
 * @returns 解析後的 package.json 物件 / Parsed package.json object
 *
 * @example
 * ```typescript
 * const pkg = readModulePackageJson('jest');
 * console.log(pkg.name);    // 'jest'
 * console.log(pkg.version); // '29.x.x'
 *
 * // 使用全域路徑 / With global paths
 * const pkg = readModulePackageJson('typescript', {
 *   includeGlobal: true,
 * });
 * ```
 */
export declare function readModulePackageJson<P extends IPackageJson = IPackageJson>(moduleName: string, options?: IOptionsRequireResolve): P;
/**
 * 解析套件並取得完整資訊
 * Resolve package and get complete information
 *
 * 此函數提供最完整的套件解析功能，返回包含套件根目錄、入口點、
 * package.json 內容及路徑解析函數的完整物件。
 * This function provides the most comprehensive package resolution,
 * returning a complete object with package root, entry point,
 * package.json content, and a path resolution function.
 *
 * @typeParam P - package.json 的類型，預設為 IPackageJson / Type of package.json, defaults to IPackageJson
 * @param moduleName - 要解析的模組名稱 / Module name to resolve
 * @param options - 解析選項 / Resolution options
 * @returns 包含完整套件資訊的物件 / Object containing complete package information
 *
 * @example
 * ```typescript
 * const info = resolvePackage('jest');
 * console.log(info.name);              // 'jest'
 * console.log(info.pkgRoot);           // '/path/to/node_modules/jest'
 * console.log(info.entryPointLocation); // '/path/to/node_modules/jest/build/index.js'
 * console.log(info.pkg.version);       // '29.x.x'
 * console.log(info.pkgJsonLocation);   // '/path/to/node_modules/jest/package.json'
 * console.log(info.resolveLocation('build/cli/index.js')); // '/path/to/node_modules/jest/build/cli/index.js'
 *
 * // 使用全域路徑 / With global paths
 * const info = resolvePackage('typescript', {
 *   includeGlobal: true,
 * });
 * ```
 */
export declare function resolvePackage<P extends IPackageJson = IPackageJson>(moduleName: string, options?: IOptionsRequireResolve): IPackageInfo<P>;
export type { IOptionsRequireResolve, IPackageCoreInfo, IPackageInfo, IPackageJson, };
