/**
 * 執行時期環境建構模組 / Runtime environment construction module
 *
 * 負責建立和配置 ncu 執行所需的完整運行環境
 * Responsible for building and configuring the complete runtime environment required for ncu execution
 */
import { IArgvRuntime, IRuntimeInput } from './types';
import { IPackageJson } from '@ts-type/package-dts/package-json';
/**
 * 處理並建立執行時期環境
 * Process and build the runtime environment
 *
 * 此函數會：
 * - 尋找 workspace 根目錄
 * - 讀取 package.json 資訊
 * - 處理 resolutions 設定
 * - 判斷是否在 workspace 模式下運行
 *
 * This function will:
 * - Find workspace root directory
 * - Read package.json information
 * - Process resolutions configuration
 * - Determine if running in workspace mode
 *
 * @param argv - 命令列參數 / Command line arguments
 * @param runtimeInput - 執行時期輸入配置 / Runtime input configuration
 * @returns 完整的執行時期環境 / Complete runtime environment
 */
export declare function _handleRuntime(argv: IArgvRuntime, runtimeInput: IRuntimeInput): {
    cwd: string;
    rootData: import("@yarn-tool/find-root").IFindRootReturnType;
    pkg_file: string;
    pkg_data: IPackageJson<unknown>;
    resolutions: import("@yarn-tool/ncu").IDependency;
    pkg_file_ws: string;
    pkg_data_ws: IPackageJson<unknown>;
    doWorkspace: boolean;
    console: import("debug-color2").Console2;
    consoleDebug: import("debug-color2").Console2;
    printRootData(rootData: import("@yarn-tool/find-root").IFindRootReturnType, argv: {
        cwd: string;
    }): void;
};
