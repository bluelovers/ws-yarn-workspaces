import { INpmAutoFixAll } from '@yarn-tool/fix-all';
import { IPackageJson } from '@ts-type/package-dts/package-json';
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
    /**
     * 啟用互動介面
     *
     * 僅 `createYarnWorkspacesAsync` 支援，sync 版本會忽略此選項；
     * 需環境具備 TTY，且在 `_checkEnv` 判定疑似錯誤路徑時才會詢問是否繼續。
     */
    interactive?: boolean;
}
/**
 * `createYarnWorkspaces` 的前置檢查結果
 */
export interface IPrecheckResult {
    /** 是否可繼續執行創建流程 */
    ok: boolean;
    /** 實際要初始化的目標路徑：優先採用既有 package 根目錄，否則退回 cwd。 */
    targetPath: string;
    /** 經參數正規化後的配置選項（第一個參數可能直接傳入選項物件） */
    options: IOptions;
}
/**
 * 創建 Workspaces 的核心前置檢查邏輯
 *
 * 處理參數正規化、尋找專案根目錄，並檢查：
 * - 是否已存在 Package
 * - 是否已存在（父層）Workspaces
 *
 * @param cwd - 工作目錄路徑；也可直接傳入 IOptions
 * @param options - 配置選項
 * @returns 前置檢查結果；`ok` 為 false 時不應繼續創建
 */
export declare function _precheckYarnWorkspaces(cwd?: string, options?: IOptions): IPrecheckResult;
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
