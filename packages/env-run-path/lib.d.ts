import { IOptionsGetRunPathCore, IOptionsFindBinPath, ProcessEnv } from './index';
import { IPathDelimiter } from '@yarn-tool/env-path';
/**
 * 從 cwd 向上搜尋所有 node_modules/.bin 目錄。
 * 先以 findRoot 推斷專案根目錄，據此推導 stopPath 與預設 cwd，
 * 讓呼叫端不必自行處理 monorepo 的根目錄差異。
 *
 * Search upward from cwd for every node_modules/.bin directory.
 * Uses findRoot to infer the project root, deriving stopPath and the default cwd from it,
 * so callers need not handle monorepo root differences themselves.
 *
 * @param options 搜尋選項 / search options
 * @returns result 為存在的 bin 目錄、history 為所有檢查過的目錄 / result = existing bin dirs, history = all dirs checked
 */
export declare function findBinPath(options?: IOptionsFindBinPath): {
    result: string[];
    history: string[];
};
/**
 * 取得 Node.js 可執行檔所在目錄。
 * execPath 可能是相對路徑，故先以 cwd resolve 再取父目錄。
 *
 * Get the directory containing the Node.js executable.
 * execPath may be relative, so it is resolved against cwd before taking the parent directory.
 *
 * @param options 需含 cwd 與 execPath / requires cwd and execPath
 * @returns 可執行檔目錄 / the executable's directory
 */
export declare function getExePath(options: IOptionsGetRunPathCore): string;
/**
 * 執行路徑的核心計算：解析 PATH 鍵名、原始 PATH 與 bin 目錄清單。
 * 不負責合併策略，供 processRunPath 與 processRunPathEnv 共用同一份邏輯。
 *
 * Core run-path computation: resolves the PATH key, the original PATH, and the bin directory list.
 * Excludes merge strategy; shared by processRunPath and processRunPathEnv to keep one source of logic.
 *
 * @param options 核心選項 / core options
 * @returns pathKey、envPath、binPaths、execPath、delimiter、processEnv / the resolved run-path data
 */
export declare function processRunPathCore<P = ProcessEnv>(options?: IOptionsGetRunPathCore<P>): {
    pathKey: string;
    envPath: any;
    binPaths: string[];
    execPath: string;
    delimiter: IPathDelimiter;
    processEnv: P;
};
