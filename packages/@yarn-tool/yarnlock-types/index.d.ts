/**
 * @yarn-tool/yarnlock-types 的型別單一來源 (SSoT)：集中定義 yarn.lock v1/v2 的列資料、
 * 解析結果與版本偵測列舉，讓所有 yarn.lock 相關套件共用同一組型別，
 * 避免各套件重複宣告導致結構漂移。
 *
 * Single source of truth (SSoT) of @yarn-tool/yarnlock-types: centralises yarn.lock
 * v1/v2 row data, parsed results and version-detection enums so every yarn.lock-related
 * package shares one set of types instead of drifting duplicate declarations.
 */
import { IDependency } from '@ts-type/package-dts/lib/package-json/types';
import { ITSTypeAndStringLiteral } from 'ts-type/lib/helper/string';
/**
 * 解析結果的聯集型別：依 `verType` 判別後即可收窄 (Narrow) 到 v1 或 v2 的形狀。
 *
 * Union of parse results: discriminating on `verType` narrows to the v1 or v2 shape.
 */
export type IYarnLockParsed = IYarnLockParsedV1 | IYarnLockParsedV2;
/**
 * 寬鬆的解析結果：刻意不綁定特定版本的列型別，
 * 用於只需要「有解析出東西」而不在意版本細節的情境，避免 TypeScript 顯示型別錯誤。
 *
 * Loose parse result: deliberately not tied to a specific version's row type, for cases
 * that only need "something was parsed" without version details, avoiding TypeScript
 * type errors.
 */
export interface IYarnLockParsedLoose<D extends IYarnLockDataRowBase = IYarnLockDataRowBase, K extends string = string> {
    /**
     * 偵測到的 lockfile 版本
     */
    verType: EnumDetectYarnLock;
    /**
     * 版本相關的中繼資料，形狀依版本而異，故以寬鬆型別表示
     */
    meta?: Record<string, any>;
    /**
     * 以鍵值對應列資料的解析結果
     */
    data: IYarnLockDataRecord<D, K>;
}
/**
 * 列資料 (Row) 的基礎形狀：無論 v1 或 v2 都一定有版本與相依列表。
 *
 * Base shape of a row: both v1 and v2 always carry a version and a dependency list.
 */
export interface IYarnLockDataRowBase {
    /**
     * 該條目安裝的版本
     */
    version: string;
    /**
     * 依賴列表
     */
    dependencies?: IDependency;
}
/**
 * yarn.lock v1 的列資料，欄位對應 @yarnpkg/lockfile 的解析結果。
 *
 * Row data of yarn.lock v1, matching the parse result of @yarnpkg/lockfile.
 */
export interface IYarnLockDataRowV1 extends IYarnLockDataRowBase {
    /**
     * 安裝來源網址
     */
    resolved?: string;
    /**
     * hash key
     */
    integrity?: string;
}
/**
 * yarn.lock v2（Berry）的列資料，欄位對應 @yarnpkg/parsers 的解析結果。
 *
 * Row data of yarn.lock v2 (Berry), matching the parse result of @yarnpkg/parsers.
 */
export interface IYarnLockDataRowV2 extends IYarnLockDataRowBase {
    /**
     * 解析用的完整鍵值（含版本範圍），v2 以獨立欄位保存而非拆成 record 鍵
     */
    resolution: string;
    /**
     * 內容雜湊，v2 以 checksum 取代 v1 的 integrity
     */
    checksum?: string;
    /**
     * 語言名稱，v2 檔案的 __metadata 相關欄位
     */
    languageName?: string | ITSTypeAndStringLiteral<EnumLanguageName>;
    /**
     * 連結方式（硬連結 / 軟連結）
     */
    linkType?: string | ITSTypeAndStringLiteral<EnumLinkType>;
}
/**
 * 以鍵值對應列資料的解析結果容器，等同 `Record<K, D>`；
 * 抽成具名型別是為了讓各套件對「yarn.lock 資料」有一致的稱呼與可替換的列型別。
 *
 * Container mapping keys to row data, i.e. `Record<K, D>`; named so packages share one
 * term for "yarn.lock data" with a swappable row type.
 */
export type IYarnLockDataRecord<D extends IYarnLockDataRowBase = IYarnLockDataRowBase, K extends string = string> = Record<K, D>;
/**
 * lockfile 版本偵測結果的列舉：`v2` 與 `v3` 為目前正式版本，
 * `berry` / `canary` 為歷史別名（已 deprecated），`unknown` 代表無法判斷。
 *
 * Version detection enum of lockfiles: `v2`/`v3` are the current versions, `berry`/
 * `canary` are deprecated historical aliases, and `unknown` means detection failed.
 */
export declare enum EnumDetectYarnLock {
    /**
     * v1（Yarn Classic，@yarnpkg/lockfile 格式）
     */
    v1 = 1,
    /**
     * v2（Yarn Berry 的既有格式）
     */
    v2 = 2,
    /**
     * @deprecated do not use this if u want check is version is berry
     * @type {EnumDetectYarnLock.berry}
     */
    berry = 2,
    /**
     * v3（Yarn Berry 較新的 lockfile 格式）
     *
     * v3 (newer lockfile format of Yarn Berry).
     */
    v3 = 3,
    /**
     * @deprecated do not use this if u want check is version is berry
     * @alias {EnumDetectYarnLock.v3}
     */
    canary = 3,
    /**
     * 無法判斷版本時的預設值，應與 `IValidYarnLockVersion` 排除使用
     */
    unknown = 0
}
/**
 * 偵測輸入的來源型別：區分是比對原始字串、簡單比對，
 * 還是已經由 parser 解析過的內容，以決定偵測流程要走到哪一步。
 *
 * Input source of detection: distinguishes raw-string comparison, simple comparison or
 * already-parsed content, deciding how far the detection flow must go.
 */
export declare const enum EnumDetectYarnLockInputType {
    /**
     * 未知來源
     */
    unknown = 0,
    /**
     * 以簡單比對判斷
     */
    simple = 1,
    /**
     * 由 parser 解析原始內容後判斷
     */
    parse_raw = 2
}
/**
 * `EnumDetectYarnLock` 的所有值（含 deprecated 別名與 unknown）。
 *
 * All values of `EnumDetectYarnLock`, including deprecated aliases and unknown.
 */
export type IEnumDetectYarnLockValues = typeof EnumDetectYarnLock[keyof typeof EnumDetectYarnLock];
/**
 * 排除 `unknown` 後的有效版本值，用於「已知版本」的型別約束。
 *
 * Valid version values with `unknown` excluded, constraining "known version" cases.
 */
export type IValidYarnLockVersion = Exclude<IEnumDetectYarnLockValues, EnumDetectYarnLock.unknown>;
/**
 * 再排除 v1 後的版本符號值（v2 / v3），
 * 供只需 Berry 系列格式的型別使用（v1 的資料結構與之不同）。
 *
 * Version symbol values without v1 (v2 / v3), for types limited to Berry-family
 * formats whose data structure differs from v1.
 */
export type IYarnLockVersionSyml = Exclude<IValidYarnLockVersion, EnumDetectYarnLock.v1>;
/**
 * 解析結果 meta 內的版本字串，限定為數字組成的字面型別。
 *
 * Version string inside a parse result's meta, restricted to a numeric literal type.
 */
export type IYarnLockMetaVersion = `${number}`;
/**
 * v1 的解析結果：`verType` 固定為 `v1`，
 * `meta.type` 標記來源是成功解析、合併結果還是衝突內容。
 *
 * Parse result of v1: `verType` is fixed to `v1`, and `meta.type` marks whether the
 * source is a successful parse, a merge result or a conflict.
 */
export interface IYarnLockParsedV1<D extends IYarnLockDataRecord<IYarnLockDataRowBase> = IYarnLockDataRecord<IYarnLockDataRowV1>> {
    /**
     * 判別鍵 (Discriminant)：固定為 v1
     */
    verType: EnumDetectYarnLock.v1;
    meta?: {
        type?: string | 'success' | 'merge' | 'conflict';
        /**
         * v1 沒有 meta.version，以 never 禁止誤填
         */
        version?: never;
    };
    /**
     * v1 列資料的解析結果
     */
    data: D;
}
/**
 * v2（含 v3）的解析結果：`verType` 為 `IYarnLockVersionSyml`（v2 / v3），
 * `meta` 改以 `version` / `cacheKey` 描述 Berry 的中繼資料。
 *
 * Parse result of v2 (incl. v3): `verType` is `IYarnLockVersionSyml` (v2 / v3) and
 * `meta` describes Berry metadata via `version` / `cacheKey` instead.
 */
export interface IYarnLockParsedV2<D extends IYarnLockDataRecord<IYarnLockDataRowBase> = IYarnLockDataRecord<IYarnLockDataRowV2>> {
    /**
     * 判別鍵 (Discriminant)：v2 或 v3
     */
    verType: IYarnLockVersionSyml;
    meta?: {
        /**
         * v2 沒有 meta.type，以 never 禁止誤填
         */
        type?: never;
        /**
         * lockfile 的格式版本
         */
        version?: string;
        /**
         * Berry 的快取鍵值
         */
        cacheKey?: string;
    };
    /**
     * v2 列資料的解析結果
     */
    data: D;
}
/**
 * 從解析結果型別反推其列資料型別：
 * 以條件型別逐層檢查 `data` 內的列型別，讓呼叫端不必手動重複宣告對應的 row type。
 *
 * Infers the row type from a parse result type: conditionally unwraps the row inside
 * `data` layer by layer so callers need not redeclare the matching row type.
 */
export type IUnpackYarnLockDataRow<T extends IYarnLockParsedV1 | IYarnLockParsedV2> = T extends {
    data: IYarnLockDataRecord<infer D>;
} ? D extends IYarnLockDataRowV2 ? D : D extends IYarnLockDataRowV1 ? D : D extends IYarnLockDataRowBase ? D : never : never;
/**
 * v1 原始來源的型別標記：成功解析、合併結果或衝突內容。
 *
 * Source type marker of raw v1: successful parse, merge result or conflict.
 */
export declare const enum EnumYarnLockSourceV1Type {
    /**
     * 正常解析成功
     */
    'success' = "success",
    /**
     * 來自 git 合併後的結果
     */
    'merge' = "merge",
    /**
     * 來自 git 衝突的內容（含衝突標記）
     */
    'conflict' = "conflict"
}
/**
 * yarn.lock v1
 * @see @yarnpkg/lockfile
 *
 * `@yarnpkg/lockfile.parse()` 的回傳形狀：`type` 為解析狀態、`object` 為列資料紀錄。
 * The return shape of `@yarnpkg/lockfile.parse()`: `type` is the parse status and
 * `object` the row record.
 */
export interface IYarnLockRawSourceV1 {
    /**
     * 解析狀態，Full 版本保證存在
     */
    type?: ITSTypeAndStringLiteral<EnumYarnLockSourceV1Type>;
    /**
     * 以鍵值對應 v1 列資料的解析結果
     */
    object: IYarnLockDataRecord<IYarnLockDataRowV1>;
}
/**
 * `IYarnLockRawSourceV1` 的欄位全為必要版本，
 * 對應 parse() 成功時保證回傳的完整形狀。
 *
 * `IYarnLockRawSourceV1` with all fields required, matching the guaranteed shape
 * returned by a successful parse().
 */
export type IYarnLockRawSourceV1Full = Required<IYarnLockRawSourceV1>;
/**
 * yarn.lock v2
 * @see @yarnpkg/parsers
 *
 * `@yarnpkg/parsers` 的解析形狀：以 `__metadata` 描述格式版本，
 * 其餘鍵值直接就是 v2 列資料（與 v1 的 `object` 包裝不同）。
 * Parse shape of `@yarnpkg/parsers`: `__metadata` describes the format version while the
 * remaining keys are v2 rows directly (unlike v1's `object` wrapper).
 */
export type IYarnLockRawSourceV2 = {
    /**
     * Berry 的中繼資料，含格式版本與快取鍵值
     */
    __metadata?: {
        version?: string;
        cacheKey?: string;
    };
} & IYarnLockDataRecord<IYarnLockDataRowV2>;
/**
 * 原始解析來源的 v1 / v2 聯集，供尚未偵測版本時暫存使用。
 *
 * Union of raw v1 / v2 sources, used to hold a parse result before version detection.
 */
export type IYarnLockSource = IYarnLockRawSourceV1 | IYarnLockRawSourceV2;
/**
 * `IYarnLockRawSourceV2` 的欄位全為必要版本（`Required` 會一併放寬 `__metadata` 內的子欄位）。
 *
 * `IYarnLockRawSourceV2` with all fields required (`Required` also widens the nested
 * `__metadata` fields).
 */
export type IYarnLockRawSourceV2Full = Required<IYarnLockRawSourceV2>;
/**
 * 依賴的連結方式：硬連結 (Hard Link) 或符號連結 (Soft Link)。
 *
 * Link mode of a dependency: hard link or soft link.
 */
export declare enum EnumLinkType {
    'hard' = "hard",
    'soft' = "soft"
}
/**
 * 解析結果的語言名稱，目前只有 node 與未知兩種值。
 *
 * Language name of a parse result; currently only node and unknown.
 */
export declare enum EnumLanguageName {
    'node' = "node",
    'unknown' = "unknown"
}
