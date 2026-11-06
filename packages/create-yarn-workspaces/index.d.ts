/**
 * 創建 Workspaces 工具模組
 *
 * 提供初始化 Workspaces 專案結構的功能，
 * 包含 package.json 設定、
 * Lerna 整合、
 * 目錄創建與靜態檔案複製等功能。
 */
import { IPackageJson } from '@ts-type/package-dts/package-json';
import { INpmAutoFixAll } from '@yarn-tool/fix-all';
export * from './lib/index';
export * from './lib/util';
/**
 * 創建 Workspaces 的選項介面
 */
export interface IOptions extends Pick<INpmAutoFixAll, 'addStaticFiles' | 'noStaticFiles'> {
    /**
     * 工作目錄路徑
     */
    cwd?: string;
    /**
     * 忽略父層 Workspaces
     */
    ignoreParentWorkspaces?: boolean;
    /**
     * 忽略已存在的 Package
     */
    ignoreExistsPackage?: boolean;
    /**
     * 初始化 Package.json 的回呼函式
     * @template T - 擴展屬性類型
     * @param current - 當前的 package.json
     * @returns 修改後的 package.json
     */
    initPackageJson?<T extends Record<string, any> = {}>(current: IPackageJson): IPackageJson & T;
    /**
     * 啟用除錯模式
     */
    debug?: boolean;
}
/**
 * 創建 Workspaces 主函式
 *
 * 檢查並創建 Workspaces 專案結構，處理已存在 Package 與父層 Workspaces 的情況
 *
 * @param cwd - 工作目錄路徑
 * @param options - 配置選項
 * @returns 是否成功創建
 */
export declare function createYarnWorkspaces(cwd?: string, options?: IOptions): boolean;
/**
 * 內部創建 Workspaces 實作函式
 *
 * 執行實際的 Workspaces 初始化工作，包含：
 * - 讀取並更新 Lerna 配置
 * - 創建或更新 package.json
 * - 複製靜態範本檔案
 * - 創建 packages 目錄
 *
 * @param targetPath - 目標路徑
 * @param options - 配置選項
 * @returns 是否成功
 */
export declare function _createYarnWorkspaces(targetPath: string, options?: IOptions): boolean;
/**
 * 根據 packages 模式創建目錄
 *
 * 解析 packages 陣列中的目錄模式（如 "packages/*"），
 * 並創建對應的實體目錄。
 *
 * @param cwd - 當前工作目錄
 * @param packages - packages 模式陣列
 * @returns 是否有創建任何目錄
 */
export declare function createDirByPackages(cwd: string, packages: string[]): boolean;
/**
 * 預設導出創建函式
 */
export default createYarnWorkspaces;
