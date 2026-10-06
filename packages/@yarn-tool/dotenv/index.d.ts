import { DotenvParseOutput } from 'dotenv';
/**
 * 計算 dotenv 檔案清單時的模式選項。
 * 不指定時會自動從 NODE_ENV 推斷，讓大多數呼叫端無需額外設定。
 *
 * Mode options for computing the dotenv file list.
 * Inferred from NODE_ENV when omitted, so most callers need no extra configuration.
 */
export interface IDotenvFilesParams {
    /** 是否為測試模式；未指定時以 NODE_ENV === 'test' 判斷 / whether it is test mode; defaults to NODE_ENV === 'test' when unspecified */
    isTest?: boolean;
    /** 是否為開發模式（僅在非測試模式生效）/ whether it is development mode (only effective outside test mode) */
    dev?: boolean;
}
/**
 * 依模式計算待載入的 dotenv 檔案清單（依優先順序排列）。
 * 只負責計算不負責載入，方便呼叫端先確認清單再決定是否載入。
 *
 * Computes the ordered list of dotenv files to load (highest priority first).
 * Computes only, without loading, so callers can inspect the list before loading.
 *
 * @param options 模式選項 / mode options
 * @returns isTest、dev、mode 與 dotenvFiles / isTest, dev, mode and dotenvFiles
 */
export declare function dotEnvFiles(options?: IDotenvFilesParams): {
    isTest: boolean;
    dev: boolean;
    mode: string;
    dotenvFiles: string[];
};
/**
 * 從 cwd 逐層向上尋找 dotenv 檔並載入（套件主要入口）。
 * 搜尋至工作區根目錄為止；每一層依優先序嘗試，第一個成功載入者即回傳。
 *
 * Walks upward from cwd to locate and load a dotenv file (main entry).
 * Stops at the workspace root; each level tries files by priority and the first successful load wins.
 *
 * @param cwd 起始目錄，預設 process.cwd() / starting directory, defaults to process.cwd()
 * @param options 模式選項 / mode options
 * @returns dotenv 載入結果與 path/cwd/current/fileExists 診斷資訊 / dotenv result plus path/cwd/current/fileExists diagnostics
 */
export declare function wsEnvConfig<E extends {
    [key: string]: any;
} = typeof process.env>(cwd?: string, options?: IDotenvFilesParams): {
    path: string;
    cwd: string;
    current: string;
    fileExists: boolean;
    error?: Error & {
        code: "OBJECT_REQUIRED" | (string & {});
    } & {
        code?: string;
    };
    parsed?: DotenvParseOutput & E;
};
/**
 * 預設匯出 (Default Export)：wsEnvConfig，便於 `import wsEnvConfig from '@yarn-tool/dotenv'` 直接使用。
 *
 * Default export: wsEnvConfig, for using it directly via `import wsEnvConfig from '@yarn-tool/dotenv'`.
 */
export default wsEnvConfig;
