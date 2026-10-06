import { IOptions } from './types';
/**
 * 整理並補齊快取選項，讓呼叫端可以只傳字串（視為 cwd）或部分選項
 * Normalize and fill in cache options so callers may pass only a string (treated as cwd) or a partial object
 *
 * @param {IOptions | string} [options] - 選項物件或單一字串 cwd / Options object or a plain cwd string
 * @returns {IOptions} 已補齊預設值的選項 / Options with defaults resolved
 */
export declare function handleOptions(options?: IOptions | string): IOptions;
/**
 * 判斷該快取來源是否允許建立目錄
 * Whether the given cache source is allowed to create its directory
 *
 * 專案內的 node_modules 來源必定可建立；其餘來源需明確設定 create，
 * 以免在唯讀或系統級位置擅自開目錄。
 * The in-project node_modules source is always creatable; other sources require an explicit create,
 * to avoid creating directories in read-only or system-wide locations.
 *
 * @param {IOptions} options - 已整理的選項 / Normalized options
 * @param {Function} fn - 目前嘗試的快取來源函式 / Cache source function currently being tried
 * @returns {boolean} 是否可建立目錄 / Whether the directory may be created
 */
export declare function _createAble(options: IOptions, fn: any): boolean;
/**
 * 驗證快取路徑可用性，必要時建立目錄
 * Validate that the cache path is usable, creating it when required
 *
 * 依序檢查「有回傳值」、「型別為字串」、「存在與可寫入」，
 * 每一層都給出不同的錯誤訊息，方便呼叫端分辨是找不到來源還是來源不可寫。
 * Checks value presence, string type, then existence/writability in order;
 * each layer yields a distinct error so callers can tell "no source" from "not writable".
 *
 * @param {string} dir - 待驗證的路徑 / Path to validate
 * @param {IOptions} options - 已整理的選項 / Normalized options
 * @returns {boolean} 驗證通過時回傳 true / True when validation passes
 * @throws {Error} 路徑無效、不存在或不可寫入時 / When the path is missing, absent, or read-only
 */
export declare function _check(dir: string, options: IOptions): boolean;
