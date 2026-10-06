/**
 * @lazy-node/semver-parse 類型定義
 * Type definitions for @lazy-node/semver-parse
 *
 * 此模組定義了 semver 解析所需的類型系統
 * This module defines the type system required for semver parsing
 *
 * @packageDocumentation
 */
import { ITSPartialRecord, ITSRequiredPick } from 'ts-type/lib/type/record';
import { SimpleSemVer } from './SimpleSemVer';
import { ITSToStringLiteral, ITSTypeAndStringLiteral } from 'ts-type';
/**
 * 基礎運算子列舉
 * Base operator enum
 *
 * 定義 semver 範圍運算子的基本集合
 * Defines the basic set of semver range operators
 */
export declare const enum EnumOperatorBase {
    /** 相容版本 (Compatible with version) */
    TILDE = "~",
    /** 插入版本 (Caret version) */
    CARET = "^",
    /** 大於等於 (Greater than or equal) */
    GTE = ">=",
    /** 小於等於 (Less than or equal) */
    LTE = "<=",
    /** 等於 (Equal) */
    EQ = "=",
    /** 範圍 (Range) */
    HYPHEN = "-",
    /** 或 (Or) */
    OR = "||",
    /** 相容版本 (Compatible with version, alternative) */
    TILDE_ALT = "~>",
    /** 大於 (Greater than) */
    GT = ">",
    /** 小於 (Less than) */
    LT = "<"
}
/**
 * 萬用字元列舉
 * Wildcard enum
 *
 * 定義 semver 範圍中可用的萬用字元，於解析/合併時用來判斷「未指定的段落」
 * Defines the wildcards usable inside a semver range; used by parse/merge to
 * detect "unspecified segments"
 */
export declare const enum EnumSemverWildcard {
    /** 以 x 表示的萬用字元 / Wildcard written as x */
    x = "x",
    /** 以 * 表示的萬用字元 / Wildcard written as * */
    star = "*"
}
/**
 * 基礎運算子類型
 * Base operator type
 *
 * 定義 semver 範圍運算子的基本集合
 * Defines the basic set of semver range operators
 */
export type IOperatorBase = ITSTypeAndStringLiteral<EnumOperatorBase>;
/**
 * 萬用字元類型 / Wildcard type
 *
 * 由 EnumSemverWildcard 推導出的字面型別，避免各處重複宣告字串常數
 * Literal type derived from EnumSemverWildcard so the string constants are
 * declared in one place only
 */
export type ISemverWildcard = ITSTypeAndStringLiteral<EnumSemverWildcard>;
/**
 * 可同時接受 number 與其字串形式的版本欄位型別
 * Version field type accepting both `number` and its string form
 *
 * 解析來源可能保留數值型別（如 parseRange 的結果），字串化前需一併相容
 * Parse results may keep numeric fields (e.g. from parseRange), so stringification must accept both
 */
export type ISemverNumber = ITSTypeAndStringLiteral<number>;
/**
 * 由數值推導出的數字字串型別（如 '0' | '1' | ...）
 * Digit-string literal type derived from `number` (e.g. '0' | '1' | ...)
 */
export type ISemverNumberString = ITSToStringLiteral<number>;
/**
 * 運算子類型
 * Operator type
 *
 * 擴展基礎運算子類型以支援自訂運算子
 * Extends base operator type to support custom operators
 */
export type IOperator = IOperatorBase | string;
/**
 * 版本三段核心欄位介面
 * Core interface for the three version segments
 *
 * minor/patch 允許萬用字元，因為範圍表示式可寫成 1.x / 1.2.*，
 * 而 major 不允許，此處刻意收窄型別以於編譯期捕捉誤植。
 * minor/patch allow wildcards because ranges may be written as 1.x / 1.2.*,
 * while major does not; the narrower type catches typos at compile time.
 */
export interface ISimpleSemVerObjectBaseCoreVersion {
    /** 主版本號 / Major version */
    major?: string | ISemverNumberString;
    /** 次版本號，可為萬用字元 / Minor version, wildcard allowed */
    minor?: string | ISemverWildcard | ISemverNumberString;
    /** 修補版本號，可為萬用字元 / Patch version, wildcard allowed */
    patch?: string | ISemverWildcard | ISemverNumberString;
}
/**
 * 僅含萬用字元 semver 欄位的介面
 * Interface holding only the wildcard `semver` field
 *
 * 用來表示 `*`、`x` 這類「整段省略」的範圍
 * Represents whole-range omissions such as `*` or `x`
 */
export interface ISimpleSemVerObjectBaseCoreWildcardOnly {
    /** 整段萬用字元 / Whole-segment wildcard */
    semver?: ISemverWildcard;
}
/**
 * 僅含運算子欄位的介面
 * Interface holding only the operator field
 *
 * 獨立拆出是為了讓 IHasOperator<> 能只針對 operator 做 Required<> 收窄
 * Split out on its own so `IHasOperator<>` can narrow just the `operator`
 * field with `Required<>`
 */
export interface ISimpleSemVerObjectBaseCoreOperator {
    /** 版本範圍運算子 / Version range operator */
    operator?: IOperator;
}
/**
 * SimpleSemVer 物件基礎介面
 * SimpleSemVer object base interface
 *
 * 定義 semver 物件的所有可選屬性
 * Defines all optional properties of a semver object
 *
 * @property {IOperator} operator - 版本範圍運算子 / Version range operator
 * @property {string} version - 完整版本字串 / Full version string
 * @property {string} semver - 包含運算子的完整 semver 字串 / Full semver string including operator
 * @property {string} major - 主版本號 / Major version number
 * @property {string} minor - 次版本號 / Minor version number
 * @property {string} patch - 修補版本號 / Patch version number
 * @property {string} release - 預發布標籤 / Pre-release tag
 * @property {string} build - 建置元資料 / Build metadata
 */
export interface ISimpleSemVerObjectBase extends ISimpleSemVerObjectBaseCoreVersion, ISimpleSemVerObjectBaseCoreOperator {
    /** 完整版本字串（不含運算子）/ Full version string without operator */
    version?: string;
    /** 包含運算子的完整 semver 字串 / Full semver string including operator */
    semver?: string;
    /** 預發布標籤 (Pre-release)，如 beta.1 / Pre-release tag, e.g. beta.1 */
    release?: string;
    /** 建置元資料 (Build metadata)，如 build.123 / Build metadata, e.g. build.123 */
    build?: string;
}
/**
 * SimpleSemVer 物件介面
 * SimpleSemVer object interface
 *
 * 表示一個已解析的 semver 版本物件
 * Represents a parsed semver version object
 */
export interface ISimpleSemVerObject extends IToSimpleSemVerObject<ISimpleSemVerObjectBase> {
    /**
     * 與基礎介面同名的可選屬性，重複宣告不改變型別語意，
     * 但可讓單獨閱讀此介面的人直接看到完整欄位。
     * Same optional property as in the base interface; re-declaring does not
     * change the type semantics, but lets readers of this interface alone see
     * the full field list.
     */
    semver?: string;
}
/**
 * 帶有運算子的 SimpleSemVer 物件介面
 * SimpleSemVer object with operator interface
 *
 * 表示一個包含運算子的 semver 版本物件
 * Represents a semver version object with an operator
 */
export interface ISimpleSemVerObjectWithOperator extends IHasOperator<ISimpleSemVerObject> {
}
/**
 * SimpleSemVer 運算子介面
 * SimpleSemVer operator interface
 *
 * 表示一個純運算子物件（如 || 或 -）
 * Represents a pure operator object (e.g., || or -)
 */
export interface ISimpleSemVerOperator extends ITSPartialRecord<Exclude<keyof ISimpleSemVerObjectBase, 'operator'>, never>, ITSRequiredPick<ISimpleSemVerObjectBase, 'operator'> {
}
/**
 * SimpleSemVer 聯合類型
 * SimpleSemVer union type
 *
 * 可能是版本物件、運算子物件或帶運算子的版本物件
 * Can be a version object, operator object, or version object with operator
 */
export type ISimpleSemVer = ISimpleSemVerObject | ISimpleSemVerOperator | ISimpleSemVerObjectWithOperator;
/**
 * 執行期可接受的 SimpleSemVer 輸入聯集
 * Runtime-acceptable SimpleSemVer input union
 *
 * 函式參數常用此型別，以便同時接收解析結果、class 實例與部分填寫的物件，
 * 真正的必要欄位於函式內部再行檢查。
 * Used for function parameters so they can accept parse results, class
 * instances, and partially-filled objects alike; required fields are checked
 * inside the function instead.
 */
export type ISimpleSemVerRuntime = ISimpleSemVer | SimpleSemVer | ISimpleSemVerObjectBase;
/**
 * 具有運算子的類型標記
 * Type marker for having an operator
 *
 * 將 T 類型標記為具有 operator 屬性
 * Marks type T as having an operator property
 */
export type IHasOperator<T extends ISimpleSemVerObjectBaseCoreOperator> = T & Required<ISimpleSemVerObjectBaseCoreOperator>;
/**
 * 轉換為 SimpleSemVer 運算子類型
 * Convert to SimpleSemVer operator type
 *
 * 表示一個僅包含運算子的類型
 * Represents a type containing only an operator
 */
export type IToSimpleSemVerOperator<T extends ISimpleSemVerObjectBase> = IHasOperator<T> & {
    /** 以 never 收窄，排除「同時是運算子物件又有主版本號」的矛盾組合 / Narrowed to `never` to rule out the contradictory "operator object with a major version" shape */
    major?: never;
};
/**
 * 轉換為 SimpleSemVer 物件類型
 * Convert to SimpleSemVer object type
 *
 * 表示一個包含主版本號的有效版本物件
 * Represents a valid version object with a major version
 */
export type IToSimpleSemVerObject<T extends ISimpleSemVerObjectBase> = T & {
    major: string;
};
/**
 * 轉換為帶運算子的 SimpleSemVer 物件類型
 * Convert to SimpleSemVer object with operator type
 *
 * 表示一個包含運算子和主版本號的版本物件
 * Represents a version object with both operator and major version
 */
export type IToSimpleSemVerObjectWithOperator<T extends ISimpleSemVerObjectBase> = IHasOperator<IToSimpleSemVerObject<T>>;
/**
 * 轉換為 SimpleSemVer 物件或運算子類型
 * Convert to SimpleSemVer object or operator type
 *
 * 可能是運算子類型或版本物件類型
 * Can be either operator type or version object type
 */
export type IToSimpleSemVerObjectOrOperator<T extends ISimpleSemVerObjectBase> = IToSimpleSemVerOperator<T> | IToSimpleSemVerObject<T>;
/**
 * 字串化選項介面
 * Stringify options interface
 *
 * 允許在輸出時省略預發布標籤或建置元資料，
 * 例如只要回傳用於比對的基準版本時。
 * Allows omitting the pre-release tag or build metadata on output, e.g. when
 * only a baseline version for comparison is wanted.
 */
export interface IOptionsSimpleSemVerStringify {
    /** 省略建置元資料 (Build metadata) / Omit build metadata */
    removeBuild?: boolean;
    /** 省略預發布標籤 (Pre-release) / Omit pre-release tag */
    removeRelease?: boolean;
}
