/**
 * 計算套件初始化目標路徑
 * Calculate package initialization target path
 *
 * 此模組用於在 Yarn Workspaces 環境中，根據套件名稱解析出正確的目標目錄路徑
 * This module resolves the correct target directory path based on package name in Yarn Workspaces environment
 */
import { IParseStaticPackagesPathsReturnType } from 'workspaces-config';
/**
 * 取得目標目錄配置
 * Get target directory configuration
 *
 * 根據輸入的套件名稱和工作區配置，計算出目標目錄路徑
 * Calculates the target directory path based on input package name and workspace configuration
 *
 * @param options - 配置選項 / Configuration options
 * @returns 目標目錄資訊 / Target directory information
 */
export declare function getTargetDir(options: {
    /** 輸入的套件名稱 / Input package name */
    inputName: string;
    /** 當前工作目錄 / Current working directory */
    cwd: string;
    /** 目標套件名稱（可選）/ Target package name (optional) */
    targetName?: string;
    /** 工作區根目錄路徑（可選）/ Workspace root directory path (optional) */
    hasWorkspace?: string;
    /** 工作區前綴（可選）/ Workspace prefix (optional) */
    workspacePrefix?: string;
    /** 工作區配置（可選）/ Workspace configuration (optional) */
    workspacesConfig?: IParseStaticPackagesPathsReturnType;
}): {
    /** 目標目錄路徑 / Target directory path */
    targetDir: string;
    /** 目標套件名稱 / Target package name */
    targetName: string;
    /** 當前工作目錄 / Current working directory */
    cwd: string;
    /** 是否為作用域套件模式 / Whether it's a scoped package pattern */
    scopedPackagePattern: boolean;
};
/**
 * 預設匯出 getTargetDir 函式
 * Default export of getTargetDir function
 */
export default getTargetDir;
