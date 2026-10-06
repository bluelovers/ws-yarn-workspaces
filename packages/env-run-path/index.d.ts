/**
 * 在 ProcessEnv 上保證存在 `Path` 鍵的型別輔助：
 * 因為實際鍵名可能是 Path/PATH/pat（依平台與使用者設定而異），
 * 以索引簽名無法表達「一定存在」，故用交叉型別固化該鍵。
 *
 * Type helper guaranteeing a `Path` key on ProcessEnv:
 * the actual key may be Path/PATH/pat (varies by platform and user config),
 * which an index signature cannot express as "always present", so an intersection pins the key.
 */
type ProcessEnvCore<P> = P & {
    Path: string;
};
/**
 * 載入合併後 PATH 的環境物件型別，保證 `Path` 鍵存在。
 *
 * Env object type carrying the merged PATH, guaranteeing the `Path` key exists.
 */
export type ProcessEnv = ProcessEnvCore<typeof process.env>;
/**
 * 尋找 bin 路徑時的共用選項。
 * stopPath 允許 boolean 是為了讓呼叫端用 true/false 快速切換
 * 「以專案根目錄為終點」與「不限制終點」兩種模式。
 *
 * Shared options for locating bin paths.
 * stopPath accepts a boolean so callers can switch quickly between
 * "stop at project root" and "no stop limit" modes.
 */
export interface IOptionsFindBinPath {
    /** 搜尋起始目錄，預設 process.cwd() / starting directory, defaults to process.cwd() */
    cwd?: string;
    /** 向上搜尋的終點；true/null 為專案根目錄、false 不設限 / upward search stop; true/null = project root, false = unlimited */
    stopPath?: string | string[] | boolean;
}
/**
 * 撈取執行路徑核心計算所需的選項，不含 PATH 合併策略，
 * 供 processRunPathCore 與需要較低階結果的呼叫端重複使用。
 *
 * Options for the core run-path computation, excluding PATH merge strategy;
 * reused by processRunPathCore and callers that need lower-level results.
 */
export interface IOptionsGetRunPathCore<P = ProcessEnv> extends IOptionsFindBinPath {
    /** 要合併的原始 PATH 字串，預設取自 processEnv / original PATH string to merge, defaults from processEnv */
    envPath?: string;
    /** Node.js 可執行檔路徑，預設 process.execPath / Node.js executable path, defaults to process.execPath */
    execPath?: string;
    /** 要操作的環境物件，預設 process.env / env object to operate on, defaults to process.env */
    processEnv?: P | ProcessEnv;
}
/**
 * processRunPath 的完整選項，於核心計算之上追加
 * PATH 的合併策略（置前/置後、是否含原本 PATH、是否附加 execPath）。
 *
 * Full options for processRunPath, adding PATH merge strategy
 * on top of the core computation (prepend/append, include original PATH, append execPath).
 */
export interface IOptionsGetRunPath<P = ProcessEnv> extends IOptionsGetRunPathCore<P> {
    /** 將本機 bin 路徑置於最前（優先執行本機版本）/ put local bin paths first (prefer local versions) */
    prepend?: boolean;
    /** 是否將 Node.js 可執行檔目錄附加至結尾 / whether to append the Node.js executable directory at the end */
    appendExecPath?: boolean;
    /** 合併結果是否包含原本的 PATH / whether to include the original PATH in the merged result */
    includeEnvPath?: boolean;
}
/**
 * 計算合併後的 PATH 字串但不寫回環境變數，讓呼叫端自行決定套用時機
 * （例如先比對或記錄再寫入）。
 *
 * Computes the merged PATH string without writing it back to the environment,
 * letting callers decide when to apply it (e.g. compare or log first).
 *
 * @param options 合併策略選項 / merge strategy options
 * @returns 含 result（合併後字串）、processEnv、pathKey、delimiter 的物件 / object with result (merged string), processEnv, pathKey, delimiter
 */
export declare function processRunPath<P = ProcessEnv>(options?: IOptionsGetRunPath<P>): {
    result: string;
    processEnv: P;
    pathKey: string;
    delimiter: import("path-env2").IPathDelimiter;
};
/**
 * processRunPathEnv 的選項，多出 overwrite 以控制
 * 是否直接修改傳入的 processEnv（預設複製一份，避免污染呼叫端的引用）。
 *
 * Options for processRunPathEnv, adding overwrite to control whether the
 * given processEnv is mutated directly (copied by default to avoid polluting the caller's reference).
 */
export interface IOptionsGetRunPathEnv<P = ProcessEnv> extends IOptionsGetRunPath<P> {
    /** 為 true 時直接修改 processEnv、否則先淺複製 / when true mutate processEnv directly, otherwise shallow-copy first */
    overwrite?: boolean;
}
/**
 * 計算合併後的 PATH 並寫入環境物件（強制 includeEnvPath 以保留原本 PATH）。
 * 預設先複製 processEnv 再寫入，避免副作用擴散到共用的 process.env 引用。
 *
 * Computes the merged PATH and writes it into the env object (force-enables includeEnvPath to keep the original PATH).
 * Copies processEnv before writing by default so side effects do not spread to the shared process.env reference.
 *
 * @param options 合併與覆寫選項 / merge and overwrite options
 * @returns 已寫入 PATH 的環境物件 / the env object with PATH written
 */
export declare function processRunPathEnv<P = ProcessEnv>(options?: IOptionsGetRunPathEnv<P>): ProcessEnvCore<P>;
/**
 * 預設匯出 (Default Export)：最常見的用法，直接取得已寫入 PATH 的環境物件。
 *
 * Default export: the most common usage, returning the env object with PATH already written.
 */
export default processRunPathEnv;
