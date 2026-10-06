/**
 * 檢查 npm 套件是否已發布
 * Check whether an npm package is published
 *
 * 對 registry 的查詢一律以 Promise 表達，
 * package-json 抛出的 PackageNotFoundError / VersionNotFoundError
 * 會在內部轉為結構化結果，避免呼叫端需處理多種例外。
 *
 * Registry lookups are always expressed as a Promise; the
 * PackageNotFoundError / VersionNotFoundError thrown by package-json are
 * converted into structured results so callers need not catch many errors.
 */
import { IOptions } from '@yarn-tool/npa-to-deps-query';
import { ITSResolvable } from 'ts-type';
import { IDepsResult } from '@yarn-tool/npa-to-deps';
import Bluebird from 'bluebird';
import { IResult } from '@yarn-tool/npm-package-arg-util';
/**
 * 查詢狀態列舉：以數值編碼便於快取與序列化
 * Query state enum: numeric codes ease caching and serialization
 */
export declare const enum EnumIsPublishedState {
    /** 套件存在且版本符合 / Package exists and the version matches */
    VersionPublished = 0,
    /** 套件存在但版本不存在 / Package exists, but the version does not */
    VersionNotFound = 1,
    /** 整個套件不存在 / The package itself does not exist */
    PackageNotFound = 2
}
/**
 * 所有查詢結果共用的基礎欄位
 * Shared base fields for every query result
 */
export interface IPublishedResultBase {
    /** 原始 npa 解析結果，供呼叫端追溯輸入 / The original npa result, for tracing the input */
    depsResult: IDepsResult<IResult>;
    /** 套件是否存在 / Whether the package exists */
    exists: boolean;
    /** true=已發布、false=版本不存在、null=套件不存在 / true=published, false=version missing, null=package missing */
    isPublished: null | boolean;
    /** 狀態列舉，與 exists / isPublished 一致 / State enum, consistent with exists / isPublished */
    state: EnumIsPublishedState;
}
/**
 * 版本已發布的結果（含 registry 實際回傳資訊）
 * Result when the version is published (includes registry response)
 */
export interface IPublishedResultVersionPublished extends IPublishedResultBase {
    /** registry 查到的套件名稱與版本 / Package name and version returned by the registry */
    queryResult: {
        name: string;
        value: string;
    };
    exists: true;
    isPublished: true;
    state: EnumIsPublishedState.VersionPublished;
}
/**
 * 套件存在但版本不存在的結果
 * Result when the package exists but the version does not
 *
 * queryResult 為選填：只有成功查到版本時才有值。
 * queryResult is optional: present only when a version was actually found.
 */
export interface IPublishedResultVersionNotFound extends IPublishedResultBase {
    queryResult?: {
        name: string;
        value: string;
    };
    exists: true;
    isPublished: false;
    state: EnumIsPublishedState.VersionNotFound;
}
/**
 * 套件完全不存在的結果
 * Result when the package does not exist at all
 *
 * isPublished 必為 null（未知而非 false），因為無從得知版本狀態。
 * isPublished must be null (unknown, not false) since the version cannot exist.
 */
export interface IPublishedResultPackageNotFound extends IPublishedResultBase {
    exists: false;
    isPublished: null;
    state: EnumIsPublishedState.PackageNotFound;
}
/**
 * 查詢結果聯合型別：依 exists / state 可縮窄至對應介面
 * Union result type: narrows to the matching interface via exists / state
 */
export type IPublishedResult = IPublishedResultVersionPublished | IPublishedResultVersionNotFound | IPublishedResultPackageNotFound;
/**
 * 以 npa 解析結果查詢是否已發布（核心）
 * Query published state from an npa result (core)
 *
 * 依序處理「版本查不到」再「套件查不到」：
 * 特定於版本的失敗先被攔下並標為 VersionNotFound，
 * 套件層級的失敗則留給最後一段作為兜底。
 *
 * Handles "version missing" first, then "package missing": a version-specific
 * failure is intercepted first as VersionNotFound, while the package-level
 * failure is left as the last-resort fallback.
 *
 * @param depsResult - npa 解析結果（可為 Promise）/ npa result (may be a Promise)
 * @param options - registry 查詢選項 / Registry query options
 * @returns 結構化查詢結果 / Structured query result
 */
export declare function _isPublishedCoreByNpaResult(depsResult: ITSResolvable<IDepsResult<IResult>>, options?: IOptions): Bluebird<IPublishedResult>;
/**
 * 以輸入字串查詢是否已發布（核心）
 * Query published state from an input string (core)
 *
 * 先以 npa 解析輸入，再委派給 _isPublishedCoreByNpaResult；
 * 以 .then() 串接可確保解析失敗也走 Promise 路徑而非同步拋錯。
 *
 * Parses the input with npa, then delegates to _isPublishedCoreByNpaResult;
 * chaining via .then() keeps parse failures on the Promise path instead of
 * throwing synchronously.
 *
 * @param input - npm 規格字串 / npm spec string
 * @param options - registry 查詢選項 / Registry query options
 * @returns 結構化查詢結果 / Structured query result
 */
export declare function _isPublishedCore(input: string, options?: IOptions): Bluebird<IPublishedResult>;
/**
 * 以 package.json 物件查詢是否已發布（核心）
 * Query published state from a package.json object (core)
 *
 * 組合成 `${name}@${version}` 可沿用與字串輸入完全相同的解析與查詢流程。
 * Composing `${name}@${version}` reuses the exact same parse/query path as string input.
 *
 * @param pkg - 含 name 與 version 的物件 / Object with name and version
 * @param options - registry 查詢選項 / Registry query options
 * @returns 結構化查詢結果 / Structured query result
 */
export declare function _isPublishedCoreByPackageJSON(pkg: {
    name: string;
    version: string;
}, options?: IOptions): Bluebird<IPublishedResult>;
/**
 * 以 npa 解析結果查詢是否已發布
 * Query whether published from an npa result
 *
 * @param depsResult - npa 解析結果（可為 Promise）/ npa result (may be a Promise)
 * @param options - registry 查詢選項 / Registry query options
 * @returns true=已發布、false=版本不存在、null=套件不存在 / true=published, false=version missing, null=package missing
 */
export declare function isPublishedByNpaResult(depsResult: ITSResolvable<IDepsResult>, options?: IOptions): Bluebird<boolean>;
/**
 * 以輸入字串查詢是否已發布
 * Query whether published from an input string
 *
 * @param input - npm 規格字串，如 `pkg@1.0.0` / npm spec string, e.g. `pkg@1.0.0`
 * @param options - registry 查詢選項 / Registry query options
 * @returns true=已發布、false=版本不存在、null=套件不存在 / true=published, false=version missing, null=package missing
 */
export declare function isPublished(input: string, options?: IOptions): Bluebird<boolean>;
/**
 * 以 package.json 物件查詢是否已發布
 * Query whether published from a package.json object
 *
 * @param pkg - 含 name 與 version 的物件 / Object with name and version
 * @param options - registry 查詢選項 / Registry query options
 * @returns true=已發布、false=版本不存在、null=套件不存在 / true=published, false=version missing, null=package missing
 */
export declare function isPublishedByPackageJSON(pkg: {
    name: string;
    version: string;
}, options?: IOptions): Bluebird<boolean>;
/**
 * 預設匯出為最常見的「檢查自己的 package.json」情境
 * Default export targets the commonest case: checking your own package.json
 */
export default isPublishedByPackageJSON;
