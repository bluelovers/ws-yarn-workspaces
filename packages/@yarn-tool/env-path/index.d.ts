import { IRecordLike } from 'value-from-record';
import { IPathDelimiter } from 'path-env2';
export type { IPathDelimiter };
/**
 * 平台的 PATH 分隔符號：在此統一轉型是因為 path.delimiter 的型別為 string，
 * 而 path-env2 需要更窄的 IPathDelimiter，於此收斂型別可避免各呼叫端重複斷言。
 *
 * Platform PATH delimiter: the cast is done here because path.delimiter is typed as
 * string while path-env2 expects the narrower IPathDelimiter, so callers avoid repeated assertions.
 */
declare const delimiter: IPathDelimiter;
export { delimiter };
/**
 * 取得 process.env；在某些受限環境（例如沙箱）中存取 process.env 可能拋出例外，
 * 因此提供 ignoreErrors 讓呼叫端選擇忽略並回傳 undefined，而非中斷流程。
 *
 * Get process.env; accessing it may throw in restricted environments (e.g. sandboxes),
 * so ignoreErrors lets callers ignore the error and receive undefined instead of aborting.
 *
 * @param ignoreErrors 為 true 時忽略存取失敗並回傳 undefined / when true, ignore access errors and return undefined
 * @returns process.env 或 undefined / process.env or undefined
 */
export declare function processEnv(ignoreErrors?: boolean): NodeJS.ProcessEnv;
/**
 * 在給定環境物件中找出 PATH 的實際鍵名。
 * Windows 上鍵名可能為 Path 或 PATH（大小寫不一致），直接寫死 'PATH' 會取不到值，
 * 故交由 keyFromRecord 做大小寫不敏感的比對。
 *
 * Find the actual key name of PATH in the given env object.
 * On Windows the key may be Path or PATH (inconsistent casing), so hardcoding 'PATH' can fail;
 * keyFromRecord performs a case-insensitive lookup instead.
 *
 * @param env 環境物件，預設 process.env / env object, defaults to process.env
 * @returns PATH 的實際鍵名 / the actual key name of PATH
 */
export declare function envPathKey(env?: IRecordLike<string, any>): string;
/**
 * 讀取 PATH 環境變數的字串值。
 * key 省略時自動偵測實際鍵名，讓呼叫端不必處理 Windows 的大小寫差異。
 *
 * Read the string value of the PATH environment variable.
 * When key is omitted the actual key is detected automatically, so callers need not handle Windows casing differences.
 *
 * @param env 環境物件，預設 process.env / env object, defaults to process.env
 * @param key PATH 的鍵名，預設自動偵測 / PATH key, detected automatically by default
 * @returns PATH 字串值 / the PATH string value
 */
export declare function getEnvPathValue(env?: IRecordLike<string, any>, key?: string): string;
/**
 * 寫入 PATH 環境變數。
 * 接受陣列形式以便呼叫端以路徑陣列操作，內部統一 join 成平台分隔字串後寫入。
 *
 * Set the PATH environment variable.
 * Accepts an array so callers can work with path lists; it is joined with the platform delimiter before writing.
 *
 * @param value 要寫入的 PATH 值（字串或路徑陣列）/ value to write (string or array of paths)
 * @param env 環境物件，預設 process.env / env object, defaults to process.env
 * @param key PATH 的鍵名，預設自動偵測 / PATH key, detected automatically by default
 * @param delim 陣列連接用的分隔符號，預設平台 delimiter / delimiter used to join the array, defaults to platform delimiter
 */
export declare function setEnvPathValue(value: string | string[], env?: IRecordLike<string, string>, key?: string, delim?: IPathDelimiter): IRecordLike<string, string>;
/**
 * 將 PATH 解析後只回傳 path 欄位的便捷函式。
 * 適合只關心路徑陣列、不需其餘環境變數內容的常見情境。
 *
 * Convenience wrapper returning only the `path` field of the parsed PATH.
 * Useful when only the path array is needed and not the rest of the env content.
 *
 * @param env 環境物件，預設 process.env / env object, defaults to process.env
 * @param key PATH 的鍵名，預設自動偵測 / PATH key, detected automatically by default
 * @param delim 分隔符號，預設平台 delimiter / delimiter, defaults to platform delimiter
 */
export declare function envPathObject(env?: IRecordLike<string, any>, key?: string, delim?: IPathDelimiter): {
    get: {
        factory(): import("path-env2").IPathFactory;
        string(): import("path-env2").IPathString;
        array(): import("path-env2").IPathArray;
        delim(): IPathDelimiter;
        name(): string;
    };
    set: {
        factory(x: import("path-env2").IPathFactory): import("path-env2").IEnvFactory;
        string(x: import("path-env2").IPathString): import("path-env2").IEnvFactory;
        array(x: import("path-env2").IPathArray): import("path-env2").IEnvFactory;
        delim(x: IPathDelimiter): import("path-env2").IEnvFactory;
        name(x: string): import("path-env2").IEnvFactory;
    };
    append(addend: import("path-env2").IPathArray): import("path-env2").IEnvFactory;
    prepend(addend: import("path-env2").IPathArray): import("path-env2").IEnvFactory;
    surround(addend: import("path-env2").IPathArray): import("path-env2").IEnvFactory;
    deduplicate(): import("path-env2").IEnvFactory;
};
/**
 * 將環境變數中的 PATH 字串解析為結構化物件（交由 path-env2 處理）。
 * Map 等具 entries() 的類別需先轉成一般物件，否則 path-env2 無法以 record 方式存取。
 *
 * Parse the PATH string in the env object into a structured object (delegated to path-env2).
 * Map-like objects with entries() are converted to plain objects first, otherwise path-env2 cannot access them as records.
 *
 * @param env 環境物件，預設 process.env / env object, defaults to process.env
 * @param key PATH 的鍵名，預設自動偵測 / PATH key, detected automatically by default
 * @param delim 分隔符號，預設平台 delimiter / delimiter, defaults to platform delimiter
 * @returns 含 path 陣列等欄位的解析結果 / parsed result containing the path array and other fields
 */
export declare function envObject(env?: IRecordLike<string, any>, key?: string, delim?: IPathDelimiter): import("path-env2").IEnvFactory;
/**
 * 預設匯出 (Default Export)：最常用的入口，直接回傳解析後的 path 欄位。
 *
 * Default export: the most common entry point, returning the parsed `path` field directly.
 */
export default envPathObject;
