/**
 * Workspace 版本修復工具
 * Workspace version fix utility
 *
 * 用於同步和修復 monorepo workspace 中的套件版本依賴
 * Used to sync and fix package version dependencies in monorepo workspaces
 *
 * 除了 plain 版本範圍，也處理 [Workspace protocol](https://pnpm.io/workspaces#workspace-protocol-workspace)：
 * 預設會把 `workspace:*` / `workspace:^` / `workspace:~` / `workspace:^1.2.3` 轉換為一般版本範圍，
 * 設定 `saveWorkspaceProtocol: true` 則保留既有的 `workspace:` 前綴。
 *
 * Besides plain version ranges this also handles the Workspace protocol: by default `workspace:*`,
 * `workspace:^`, `workspace:~` and `workspace:^1.2.3` are converted into plain version ranges, while
 * `saveWorkspaceProtocol: true` keeps an existing `workspace:` prefix in place.
 */
import { IListableRow, IListableRowExtraWithDeps } from 'ws-pkg-list/lib/types';
import { IPackageJsonDependenciesField, IDependency } from '@ts-type/package-dts/lib/package-json/types';
import { ITSPartialRecord } from 'ts-type/lib/type/record';
import { ITSRequireAtLeastOne } from 'ts-type/lib/type/record';
/**
 * 版本修復結果映射介面
 * Version fix result map interface
 */
export interface IMap<R extends IListableRow> {
    /** 已變更的套件列表 / List of changed packages */
    changed: R[];
    /** 未變更的套件列表 / List of unchanged packages */
    others: R[];
    /** 版本資料映射 / Version data mapping */
    data: Record<string, string>;
}
/**
 * 執行時快取介面
 * Runtime cache interface
 */
export interface ICache<R extends IListableRow = IListableRow> {
    /** 可列出的套件列表 / Listable packages list */
    listable?: R[];
    /** 套件名稱到資料的映射 / Package name to data mapping */
    record?: Record<string, R>;
    /** 套件名稱列表 / Package names list */
    names?: string[];
    /** 結果映射 / Result map */
    map?: IMap<R>;
}
/**
 * 快取輸入類型（至少需要 listable 或 record）
 * Cache input type (requires at least listable or record)
 */
export type ICacheInput<R extends IListableRow = IListableRow> = ITSRequireAtLeastOne<ICache<R>, 'listable' | 'record'>;
/**
 * 預設 Workspace protocol 前綴
 * Default Workspace protocol prefix
 *
 * @see https://pnpm.io/workspaces#workspace-protocol-workspace
 */
export declare const DEFAULT_WORKSPACE_PROTOCOL = "workspace:";
/**
 * Workspace protocol 相關選項
 * Options related to the Workspace protocol
 */
export interface IOptionsWorkspaceProtocol {
    /**
     * Workspace protocol 前綴，預設 `workspace:`
     * Workspace protocol prefix, defaults to `workspace:`
     *
     * 為求未來擴充性可替換成其他 protocol；以字面比對，分隔符（如 `:`）需自行包含在內。
     * Kept configurable so it can be swapped for another protocol in the future; matched literally,
     * include the separator (e.g. `:`) yourself.
     */
    protocol?: string;
}
/**
 * 取得目前使用的 Workspace protocol 前綴
 * Get the Workspace protocol prefix currently in use
 */
export declare function getWorkspaceProtocol(opts?: IOptionsWorkspaceProtocol): string;
/**
 * 偵測版本字串是否為 Workspace protocol
 * Detect whether a version string uses the Workspace protocol
 */
export declare function isWorkspaceProtocol(value: unknown, opts?: IOptionsWorkspaceProtocol): value is string;
/**
 * 解析 Workspace protocol 的結果
 * Result of parsing a Workspace protocol specifier
 */
export interface IParsedWorkspaceProtocol {
    /** 原始字串 / The original string */
    value: string;
    /** 偵測到的 protocol 前綴 / The detected protocol prefix */
    protocol: string;
    /** 移除 protocol 後的版本範圍 / The version range after removing the protocol */
    range: string;
}
/**
 * 解析 Workspace protocol，非 Workspace protocol 時回傳 null
 * Parse a Workspace protocol; returns null when it is not a Workspace protocol
 */
export declare function parseWorkspaceProtocol(value: string, opts?: IOptionsWorkspaceProtocol): IParsedWorkspaceProtocol | null;
/**
 * 判斷移除 protocol 後的範圍是否為 bare operator（`*` / `^` / `~` / 空字串）
 * Whether the range (after removing the protocol) is a bare operator (`*` / `^` / `~` / empty)
 */
export declare function isWorkspaceProtocolBareRange(range: string): boolean;
/**
 * 以套件實際版本解析 bare operator 的選項
 * Options for resolving bare operators with the actual package version
 */
export interface IOptionsWorkspaceProtocolToRange extends IOptionsWorkspaceProtocol {
    /**
     * 套件實際版本，用於解析 bare operator（`*` / `^` / `~`）
     * The actual package version, used to resolve bare operators (`*` / `^` / `~`)
     */
    version?: string;
}
/**
 * 將 Workspace protocol 轉換為一般版本範圍
 * Convert a Workspace protocol specifier into a plain version range
 *
 * @example
 * workspaceProtocolToRange('workspace:*', { version: '1.5.0' })       // '1.5.0'
 * workspaceProtocolToRange('workspace:~', { version: '1.5.0' })       // '~1.5.0'
 * workspaceProtocolToRange('workspace:^', { version: '1.5.0' })       // '^1.5.0'
 * workspaceProtocolToRange('workspace:^1.5.0', { version: '1.5.0' })  // '^1.5.0'
 *
 * 非 Workspace protocol 時原樣回傳。
 * Returned as-is when it is not a Workspace protocol.
 */
export declare function workspaceProtocolToRange(value: string, opts?: IOptionsWorkspaceProtocolToRange): string;
/**
 * 將一般版本範圍轉回 Workspace protocol（逆向轉換），並可更換輸出的 protocol
 * Convert a plain version range back into a Workspace protocol specifier (reverse conversion),
 * with a swappable output protocol
 *
 * @example
 * rangeToWorkspaceProtocol('^1.5.0')                                   // 'workspace:^1.5.0'
 * rangeToWorkspaceProtocol('workspace:^1.5.0')                         // 'workspace:^1.5.0'（冪等）
 * rangeToWorkspaceProtocol('workspace:^1.5.0', { protocol: 'custom:' }) // 'custom:^1.5.0'
 *
 * 純版本範圍不會包含 `:`，因此既有的 protocol 前綴會被移除後再接上目標 protocol，
 * 除了避免重複疊加，也能藉由 `protocol` 更換輸出的 protocol。
 * A plain version range never contains `:`, so any existing protocol prefix is removed before the
 * target protocol is prepended; this avoids double-prefixing and lets `protocol` swap the output.
 */
export declare function rangeToWorkspaceProtocol(value: string, opts?: IOptionsWorkspaceProtocol): string;
export interface IOptionsFixWsVersions extends IOptionsWorkspaceProtocol {
    /**
     * 是否保留 Workspace protocol（`workspace:*` 等）
     * Whether to keep the Workspace protocol (`workspace:*` and friends)
     *
     * 為 falsy 時（預設），Workspace protocol 會被轉換為一般版本。
     * When falsy (the default), the Workspace protocol is converted into a plain version range.
     *
     * 此選項只「保留」既有的 `workspace:` 前綴，不會反過來替原本沒有 protocol 的引用補上前綴；
     * 也無法修復 bare operator（`workspace:*` / `^` / `~`），因為其本身沒有版本可修復。
     * The option only *keeps* an existing `workspace:` prefix; it never back-fills that prefix onto
     * references that had no protocol to begin with. It also cannot fix a bare operator
     * (`workspace:*` / `^` / `~`), because such a specifier carries no version to fix.
     *
     * @see https://pnpm.io/workspaces#workspace-protocol-workspace
     */
    saveWorkspaceProtocol?: boolean;
    /**
     * 當前工作目錄 / Current working directory
     */
    cwd?: string;
}
/**
 * 正規化 fix 系列函式的參數組合
 * Normalize the argument combinations accepted by the fix functions
 *
 * 支援三種呼叫型態：單一字串 `cwd`、單一選項物件，或「前項 + 附加選項」。
 * Supports three call shapes: a bare `cwd` string, a single options object, or
 * "first argument + extra options".
 *
 * @param {string | IOptionsFixWsVersions} [cwd] - 工作目錄字串或選項物件 / a cwd string or an options object
 * @param {IOptionsFixWsVersions} [opts] - 附加選項，同名欄位以 `opts` 為準 / extra options; `opts` wins on same-named fields
 * @returns {IOptionsFixWsVersions} 正規化後的選項，保證不是 undefined / normalized options, never undefined
 *
 * @example
 * handleOptionsFixWsVersions('D:/ws')                                  // { cwd: 'D:/ws' }
 * handleOptionsFixWsVersions({ cwd: 'D:/ws' }, { saveWorkspaceProtocol: true })
 * // { cwd: 'D:/ws', saveWorkspaceProtocol: true }
 * handleOptionsFixWsVersions()                                          // {}
 */
export declare function handleOptionsFixWsVersions(cwd?: string | IOptionsFixWsVersions, opts?: IOptionsFixWsVersions): IOptionsFixWsVersions;
/**
 * 處理執行時快取，初始化所有必要欄位
 * Process runtime cache, initialize all required fields
 *
 * @param {ICacheInput<R>} cache - 輸入快取物件 / Input cache object
 * @returns {Required<ICache<R>>} 完整快取物件 / Complete cache object
 */
export declare function handleRuntimeCache<R extends IListableRow>(cache: ICacheInput<R>): Required<ICache<R>>;
/**
 * 修復套件依賴版本的核心函數
 * Core function for fixing package dependency versions
 *
 * 將 workspace 內部套件的依賴版本更新為當前實際版本
 * Updates dependency versions of internal workspace packages to current actual versions
 *
 * `saveWorkspaceProtocol` 為 falsy 時（預設），`workspace:*` 等 Workspace protocol 會被轉換為一般版本範圍。
 * When `saveWorkspaceProtocol` is falsy (the default), Workspace protocols such as `workspace:*`
 * are converted into plain version ranges.
 *
 * 反之為 truthy 時只會「保留」既有的 `workspace:` 前綴；原本沒有 protocol 的 plain 引用不會被加上前綴。
 * When truthy it only *keeps* existing `workspace:` prefixes; plain references that never had a
 * protocol are never given one.
 *
 * @param {T} row - 套件 package.json 的依賴欄位（就地修改）/ Package.json dependency fields (mutated in place)
 * @param {ICacheInput<R>} cache - 快取資料 / Cache data
 * @param {IOptionsFixWsVersions} [opts] - 修復選項 / Fix options
 * @returns {Object} 修復結果；`changed` 僅在真的有改寫時才會被賦值，否則為 undefined
 *                   Fix result; `changed` is only assigned when something was actually rewritten,
 *                   otherwise it stays undefined
 */
export declare function fixPkgDepsVersionsCore<T extends ITSPartialRecord<IPackageJsonDependenciesField, IDependency>, R extends IListableRow>(row: T, cache: ICacheInput<R>, opts?: IOptionsFixWsVersions): {
    row: T;
    map: IMap<R>;
    changed: boolean;
    cache: ICache<R>;
};
/**
 * 修復 Workspace 版本的核心函數
 * Core function for fixing workspace versions
 *
 * 遍歷所有 workspace 套件並同步其內部依賴版本；未設定 `saveWorkspaceProtocol` 時，
 * `workspace:*` 等 Workspace protocol 也會一併轉換為一般版本範圍。
 * Iterates through all workspace packages and syncs their internal dependency versions; unless
 * `saveWorkspaceProtocol` is set, Workspace protocols such as `workspace:*` are also converted into
 * plain version ranges.
 *
 * @param {R[]} listable - 可列出的套件列表 / Listable packages list
 * @param {string | IOptionsFixWsVersions} [cwd] - 當前工作目錄字串，或直接傳入選項物件 / a cwd string, or the options object itself
 * @param {IOptionsFixWsVersions} [opts] - 附加選項，`cwd` 為字串時才需要 / extra options, only needed when `cwd` is a string
 * @returns {Object} 修復結果：變更與未變更的套件，以及 `record` / `names` / `data` 映射
 *                   Fix result: changed and unchanged packages plus the `record` / `names` / `data` mappings
 *
 * @example
 * fixWsVersionsCore(listable, 'D:/ws');
 * fixWsVersionsCore(listable, { cwd: 'D:/ws', saveWorkspaceProtocol: true });
 */
export declare function fixWsVersionsCore<R extends IListableRowExtraWithDeps>(listable: R[], cwd?: string | IOptionsFixWsVersions, opts?: IOptionsFixWsVersions): {
    /** 已變更的套件列表 / List of changed packages */
    changed: R[];
    /** 未變更的套件列表 / List of unchanged packages */
    others: R[];
    /** 版本資料映射 / Version data mapping */
    data: Record<string, string>;
    cwd: string;
    listable: R[];
    record: Record<string, R>;
    names: string[];
};
/**
 * 修復 Workspace 版本的主要入口函數
 * Main entry function for fixing workspace versions
 *
 * 自動偵測 workspace 中的所有套件並同步版本
 * Automatically detects all packages in workspace and syncs versions
 *
 * @param {string | IOptionsFixWsVersions} [cwd] - 當前工作目錄字串或選項物件，預設 process.cwd()
 *                                                  a cwd string or an options object, defaults to process.cwd()
 * @param {IOptionsFixWsVersions} [opts] - 附加選項，會與 `cwd` 合併 / extra options, merged into `cwd`
 * @returns {Object} 修復結果 / Fix result
 *
 * @example
 * // 修復當前目錄的 workspace 版本
 * const result = fixWsVersions();
 * console.log(`Changed: ${result.changed.length} packages`);
 *
 * @example
 * // 保留 Workspace protocol
 * fixWsVersions(process.cwd(), { saveWorkspaceProtocol: true });
 */
export declare function fixWsVersions(cwd?: string | IOptionsFixWsVersions, opts?: IOptionsFixWsVersions): {
    /** 已變更的套件列表 / List of changed packages */
    changed: IListableRowExtraWithDeps[];
    /** 未變更的套件列表 / List of unchanged packages */
    others: IListableRowExtraWithDeps[];
    /** 版本資料映射 / Version data mapping */
    data: Record<string, string>;
    cwd: string;
    listable: IListableRowExtraWithDeps[];
    record: Record<string, IListableRowExtraWithDeps>;
    names: string[];
};
/** 預設導出 / Default export */
export default fixWsVersions;
