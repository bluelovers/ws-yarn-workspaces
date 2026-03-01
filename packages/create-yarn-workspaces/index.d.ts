/**
 * 創建 Yarn Workspaces 工具模組
 * Yarn Workspaces Creation Tool Module
 *
 * 提供初始化 Yarn Workspaces 專案結構的功能，包含 package.json 設定、
 * Lerna 整合、目錄創建與靜態檔案複製等功能。
 * Provides functionality to initialize Yarn Workspaces project structure,
 * including package.json configuration, Lerna integration, directory creation,
 * and static file copying.
 *
 * @author user
 * @since 2018/5/13/013
 */
import { IPackageJson } from '@ts-type/package-dts/package-json';
export * from './lib/index';
export * from './lib/util';
/**
 * 創建 Workspaces 的選項介面
 * Interface for creating workspaces options
 */
export interface IOptions {
    /**
     * 工作目錄路徑 / Working directory path
     */
    cwd?: string;
    /**
     * 忽略父層 Workspaces / Ignore parent workspaces
     */
    ignoreParentWorkspaces?: boolean;
    /**
     * 忽略已存在的 Package / Ignore existing package
     */
    ignoreExistsPackage?: boolean;
    /**
     * 初始化 Package.json 的回呼函式
     * Callback function to initialize package.json
     * @template T - 擴展屬性類型 / Extended property type
     * @param current - 當前的 package.json / Current package.json
     * @returns 修改後的 package.json / Modified package.json
     */
    initPackageJson?<T extends Record<string, any> = {}>(current: IPackageJson): IPackageJson & T;
    /**
     * 啟用除錯模式 / Enable debug mode
     */
    debug?: boolean;
}
/**
 * 創建 Yarn Workspaces 主函式
 * Main function to create Yarn Workspaces
 *
 * 檢查並創建 Workspaces 專案結構，處理已存在 Package 與父層 Workspaces 的情況
 * Checks and creates workspace project structure, handling existing packages
 * and parent workspaces
 *
 * @param cwd - 工作目錄路徑 / Working directory path
 * @param options - 配置選項 / Configuration options
 * @returns 是否成功創建 / Whether creation was successful
 */
export declare function createYarnWorkspaces(cwd?: string, options?: IOptions): boolean;
/**
 * 內部創建 Workspaces 實作函式
 * Internal implementation function for creating workspaces
 *
 * 執行實際的 Workspaces 初始化工作，包含：
 * - 讀取並更新 Lerna 配置
 * - 創建或更新 package.json
 * - 複製靜態範本檔案
 * - 創建 packages 目錄
 *
 * Performs actual workspace initialization including:
 * - Reading and updating Lerna configuration
 * - Creating or updating package.json
 * - Copying static template files
 * - Creating packages directory
 *
 * @param targetPath - 目標路徑 / Target path
 * @param options - 配置選項 / Configuration options
 * @returns 是否成功 / Whether successful
 */
export declare function _createYarnWorkspaces(targetPath: string, options?: IOptions): boolean;
/**
 * 根據 packages 模式創建目錄
 * Create directories based on packages pattern
 *
 * 解析 packages 陣列中的目錄模式（如 "packages/*"），
 * 並創建對應的實體目錄。
 * Parses directory patterns from packages array (e.g., "packages/*")
 * and creates corresponding physical directories.
 *
 * @param cwd - 當前工作目錄 / Current working directory
 * @param packages - packages 模式陣列 / Array of package patterns
 * @returns 是否有創建任何目錄 / Whether any directories were created
 */
export declare function createDirByPackages(cwd: string, packages: string[]): boolean;
/**
 * 預設導出創建函式
 * Default export of creation function
 */
export default createYarnWorkspaces;
