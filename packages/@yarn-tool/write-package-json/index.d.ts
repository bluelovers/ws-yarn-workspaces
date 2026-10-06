import { IWriteOptions } from '@bluelovers/fs-json';
/**
 * 補上寫入選項的預設值（2 空白縮排、檔尾換行）。
 * 以「展開原 options 再覆寫預設」的順序，讓呼叫者顯式傳入的
 * spaces / finalEOL 仍可覆蓋預設（Why：預設值不應搶先於使用者選項）。
 *
 * Fill in write-option defaults (2-space indent, final EOL). The spread comes
 * first so explicitly passed spaces / finalEOL still win over the defaults
 * (Why: caller-supplied options must take precedence over defaults).
 */
export declare function _handleOptions<T extends IWriteOptions>(options: T): T;
/**
 * 同步寫入 package.json（檔案所在目錄需已存在）。
 * 每次寫入都重新套用預設選項，避免呼叫者共用同一 options 物件時
 * 漏帶格式設定（Why：讓四個寫入函式的輸出格式永遠一致）。
 *
 * Synchronously write a package.json (its directory must already exist).
 * Defaults are re-applied on every call so a shared options object cannot
 * silently lose the formatting settings (Why: keeps the output format of all
 * four writers consistent).
 *
 * @param file 目標檔案路徑 / target file path
 * @param data 要序列化的資料 / data to serialize
 * @param options 寫入選項，預設 spaces=2、finalEOL=true / write options, defaults to spaces=2, finalEOL=true
 */
export declare function writePackageJSONSync(file: string, data: unknown, options?: IWriteOptions): void;
/**
 * 同步寫入並在需要時自動建立上層目錄（mkdir -p 語意）。
 * 適用於目標路徑可能尚未存在的情境，如產生 monorepo 子套件。
 *
 * Synchronously write while creating missing parent directories (mkdir -p
 * semantics). Useful when the target path may not exist yet, e.g. generating
 * monorepo sub-packages.
 *
 * @param file 目標檔案路徑（可含未建立的目錄）/ target path (missing dirs are created)
 * @param data 要序列化的資料 / data to serialize
 * @param options 寫入選項 / write options
 */
export declare function outputPackageJSONSync(file: string, data: unknown, options?: IWriteOptions): void;
/**
 * 非同步寫入 package.json（檔案所在目錄需已存在）。
 * 選項處理與同步版本一致，僅差在回傳 Promise。
 *
 * Asynchronously write a package.json (directory must exist). Option handling
 * matches the sync version; only the Promise return differs.
 *
 * @param file 目標檔案路徑 / target file path
 * @param data 要序列化的資料 / data to serialize
 * @param options 寫入選項 / write options
 */
export declare function writePackageJSON(file: string, data: unknown, options?: IWriteOptions): Promise<void>;
/**
 * 非同步寫入並在需要時自動建立上層目錄。
 * 與 outputPackageJSONSync 語意相同，僅差在回傳 Promise。
 *
 * Asynchronously write while creating missing parent directories. Same
 * semantics as outputPackageJSONSync, but returns a Promise.
 *
 * @param file 目標檔案路徑（可含未建立的目錄）/ target path (missing dirs are created)
 * @param data 要序列化的資料 / data to serialize
 * @param options 寫入選項 / write options
 */
export declare function outputPackageJSON(file: string, data: unknown, options?: IWriteOptions): Promise<void>;
/**
 * 預設匯出同步寫入函式——最常用的基本入口
 * （Why：一般用途即「立即寫回 package.json」）。
 *
 * Default-exports the sync writer, the most common entry point
 * (Why: the typical use case is "write the package.json back now").
 */
export default writePackageJSONSync;
