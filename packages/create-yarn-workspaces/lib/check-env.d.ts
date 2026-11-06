import type { IOptions } from './core';
/**
 * `_checkEnv` 的環境檢查報告
 */
export interface ICheckEnvReport {
    /** 被檢查的工作目錄 */
    cwd: string;
    /** 已存在的 package.json 相對路徑（cwd 根目錄與第一層子目錄） */
    files: string[];
    /** 是否疑似在錯誤的路徑執行（任一處已存在 package.json） */
    suspicious: boolean;
}
/**
 * 檢查目標目錄與其子目錄是否已存在 package.json
 *
 * 掃描 cwd 根目錄與第一層子目錄（排除 node_modules），
 * 產出可供警告輸出或互動介面顯示的報告。
 *
 * @param cwd - 要檢查的目錄
 * @param options - 配置選項（保留供呼叫端傳遞，目前未使用）
 * @returns 環境檢查報告
 */
export declare function _checkEnv(cwd: string, options?: IOptions): ICheckEnvReport;
/**
 * 以警告方式列出環境檢查報告並繼續執行
 *
 * 未啟用互動介面時的路徑：只印出警告，維持原有邏輯機制繼續創建。
 *
 * @param report - 環境檢查報告
 */
export declare function _warnCheckEnv(report: ICheckEnvReport): void;
/**
 * 列出環境檢查報告，並透過 @clack/prompts 詢問是否繼續
 *
 * @param report - 環境檢查報告
 * @returns 使用者選擇繼續時回傳 true；取消或非布林回應（如 Ctrl+C）回傳 false
 */
export declare function _confirmCheckEnv(report: ICheckEnvReport): Promise<boolean>;
/**
 * 檢測是否具備互動能力
 */
export declare function _checkInteractive(): boolean;
