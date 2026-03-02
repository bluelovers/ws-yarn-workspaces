/**
 * yarn.lock 檔案處理模組 / yarn.lock file processing module
 *
 * 負責檢查和更新 yarn.lock 檔案中的依賴版本標記
 * Responsible for checking and updating dependency version tags in yarn.lock files
 */
import { IArgvRuntime, IRuntime } from './types';
/**
 * 處理 yarn.lock 檔案的 ncu 更新
 * Process ncu updates for yarn.lock file
 *
 * 此函數會：
 * - 檢查 yarn.lock 是否存在
 * - 比對 registry 上的新版本
 * - 輸出更新報告
 * - 根據 upgrade 參數決定是否寫入檔案
 *
 * This function will:
 * - Check if yarn.lock exists
 * - Compare with newer versions on registry
 * - Output update report
 * - Decide whether to write file based on upgrade parameter
 *
 * @param argv - 命令列參數 / Command line arguments
 * @param runtime - 執行時期環境資訊（包含 rootData 和 console）/ Runtime environment info (contains rootData and console)
 */
export declare function _handleNcuYarnLock(argv: IArgvRuntime, runtime: Pick<IRuntime, 'rootData' | 'consoleDebug' | 'console'>): Promise<void>;
