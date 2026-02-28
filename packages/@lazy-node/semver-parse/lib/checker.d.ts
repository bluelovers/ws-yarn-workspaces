/**
 * @lazy-node/semver-parse 類型檢查器
 * Type checkers for @lazy-node/semver-parse
 *
 * 此模組提供 semver 物件的類型檢查和斷言函數
 * This module provides type checking and assertion functions for semver objects
 *
 * @packageDocumentation
 */
import { IHasOperator, ISemverWildcard, ISimpleSemVerObjectBase, ISimpleSemVerObjectBaseCoreOperator, ISimpleSemVerObjectBaseCoreVersion, ISimpleSemVerObjectBaseCoreWildcardOnly, IToSimpleSemVerObject, IToSimpleSemVerObjectOrOperator, IToSimpleSemVerObjectWithOperator, IToSimpleSemVerOperator } from './types';
/**
 * 檢查物件是否為 SimpleSemVer 運算子類型
 * Check if object is a SimpleSemVer operator type
 *
 * 判斷物件是否僅包含運算子而無版本資訊
 * Determines if object contains only an operator without version information
 *
 * @template T - 繼承自 ISimpleSemVerObjectBase 的類型 / Type extending ISimpleSemVerObjectBase
 * @param {T} obj - 要檢查的物件 / Object to check
 * @returns {boolean} 是否為運算子類型 / Whether it's an operator type
 *
 * @example
 * ```typescript
 * isSimpleSemVerOperatorLike({ operator: '||' }); // true
 * isSimpleSemVerOperatorLike({ operator: '>=', major: '1' }); // false
 * ```
 */
export declare function isSimpleSemVerOperatorLike<T extends ISimpleSemVerObjectBase>(obj: T): obj is IToSimpleSemVerOperator<T>;
/**
 * 斷言物件為 SimpleSemVer 運算子類型
 * Assert object is a SimpleSemVer operator type
 *
 * 如果物件不是運算子類型，拋出 TypeError
 * Throws TypeError if object is not an operator type
 *
 * @template T - 繼承自 ISimpleSemVerObjectBase 的類型 / Type extending ISimpleSemVerObjectBase
 * @param {T} obj - 要斷言的物件 / Object to assert
 * @param {boolean} [notThrow] - 若為 true 則不拋出錯誤 / If true, don't throw error
 * @throws {TypeError} 當物件不是運算子類型時 / When object is not an operator type
 *
 * @example
 * ```typescript
 * assertSimpleSemVerOperatorLike({ operator: '||' }); // 通過 / Passes
 * assertSimpleSemVerOperatorLike({ major: '1' }); // 拋出 TypeError / Throws TypeError
 * ```
 */
export declare function assertSimpleSemVerOperatorLike<T extends ISimpleSemVerObjectBase>(obj: T, notThrow?: boolean): asserts obj is IToSimpleSemVerOperator<T>;
/**
 * 檢查物件是否為 SimpleSemVer 版本物件類型
 * Check if object is a SimpleSemVer version object type
 *
 * 判斷物件是否包含有效的版本資訊（主版本號）
 * Determines if object contains valid version information (major version)
 *
 * @template T - 繼承自 ISimpleSemVerObjectBase 的類型 / Type extending ISimpleSemVerObjectBase
 * @param {T} obj - 要檢查的物件 / Object to check
 * @returns {boolean} 是否為版本物件類型 / Whether it's a version object type
 *
 * @example
 * ```typescript
 * isSimpleSemVerObjectLike({ major: '1', minor: '0', patch: '0' }); // true
 * isSimpleSemVerObjectLike({ operator: '||' }); // false
 * ```
 */
export declare function isSimpleSemVerObjectLike<T extends ISimpleSemVerObjectBase>(obj: T): obj is IToSimpleSemVerObject<T>;
export declare function isSimpleSemVerVersionLike(obj: ISimpleSemVerObjectBaseCoreVersion): obj is Required<ISimpleSemVerObjectBaseCoreVersion>;
export declare function isSimpleSemVerWildcardOnlyLike(obj: ISimpleSemVerObjectBase): obj is Required<ISimpleSemVerObjectBaseCoreWildcardOnly>;
export declare function isSemverWildcard(value: string): value is ISemverWildcard;
/**
 * 斷言物件為 SimpleSemVer 版本物件類型
 * Assert object is a SimpleSemVer version object type
 *
 * 如果物件不是版本物件類型，拋出 TypeError
 * Throws TypeError if object is not a version object type
 *
 * @template T - 繼承自 ISimpleSemVerObjectBase 的類型 / Type extending ISimpleSemVerObjectBase
 * @param {T} obj - 要斷言的物件 / Object to assert
 * @param {boolean} [notThrow] - 若為 true 則不拋出錯誤 / If true, don't throw error
 * @throws {TypeError} 當物件不是版本物件類型時 / When object is not a version object type
 *
 * @example
 * ```typescript
 * assertSimpleSemVerObjectLike({ major: '1' }); // 通過 / Passes
 * assertSimpleSemVerObjectLike({ operator: '||' }); // 拋出 TypeError / Throws TypeError
 * ```
 */
export declare function assertSimpleSemVerObjectLike<T extends ISimpleSemVerObjectBase>(obj: T, notThrow?: boolean): asserts obj is IToSimpleSemVerObject<T>;
/**
 * 檢查物件是否為帶運算子的 SimpleSemVer 版本物件類型
 * Check if object is a SimpleSemVer version object with operator type
 *
 * 判斷物件是否同時包含版本資訊和運算子
 * Determines if object contains both version information and operator
 *
 * @template T - 繼承自 ISimpleSemVerObjectBase 的類型 / Type extending ISimpleSemVerObjectBase
 * @param {T} obj - 要檢查的物件 / Object to check
 * @returns {boolean} 是否為帶運算子的版本物件類型 / Whether it's a version object with operator type
 *
 * @example
 * ```typescript
 * isSimpleSemVerObjectWithOperatorLike({ operator: '>=', major: '1' }); // true
 * isSimpleSemVerObjectWithOperatorLike({ major: '1' }); // false
 * ```
 */
export declare function isSimpleSemVerObjectWithOperatorLike<T extends ISimpleSemVerObjectBase>(obj: T): obj is IToSimpleSemVerObjectWithOperator<T>;
/**
 * 斷言物件為帶運算子的 SimpleSemVer 版本物件類型
 * Assert object is a SimpleSemVer version object with operator type
 *
 * 如果物件不是帶運算子的版本物件類型，拋出 TypeError
 * Throws TypeError if object is not a version object with operator type
 *
 * @template T - 繼承自 ISimpleSemVerObjectBase 的類型 / Type extending ISimpleSemVerObjectBase
 * @param {T} obj - 要斷言的物件 / Object to assert
 * @param {boolean} [notThrow] - 若為 true 則不拋出錯誤 / If true, don't throw error
 * @throws {TypeError} 當物件不是帶運算子的版本物件類型時 / When object is not a version object with operator type
 *
 * @example
 * ```typescript
 * assertSimpleSemVerObjectWithOperatorLike({ operator: '>=', major: '1' }); // 通過 / Passes
 * assertSimpleSemVerObjectWithOperatorLike({ major: '1' }); // 拋出 TypeError / Throws TypeError
 * ```
 */
export declare function assertSimpleSemVerObjectWithOperatorLike<T extends ISimpleSemVerObjectBase>(obj: T, notThrow?: boolean): asserts obj is IToSimpleSemVerObjectWithOperator<T>;
/**
 * 檢查物件是否具有運算子
 * Check if object has an operator
 *
 * 判斷物件是否包含有效的運算子屬性
 * Determines if object contains a valid operator property
 *
 * @template T - 繼承自 ISimpleSemVerObjectBase 的類型 / Type extending ISimpleSemVerObjectBase
 * @param {T} obj - 要檢查的物件 / Object to check
 * @returns {boolean} 是否具有運算子 / Whether it has an operator
 *
 * @example
 * ```typescript
 * hasOperator({ operator: '>=' }); // true
 * hasOperator({ major: '1' }); // false
 * ```
 */
export declare function hasOperator<T extends ISimpleSemVerObjectBaseCoreOperator>(obj: T): obj is IHasOperator<T>;
/**
 * 斷言物件具有運算子
 * Assert object has an operator
 *
 * 如果物件沒有運算子，拋出 TypeError
 * Throws TypeError if object doesn't have an operator
 *
 * @template T - 繼承自 ISimpleSemVerObjectBase 的類型 / Type extending ISimpleSemVerObjectBase
 * @param {T} obj - 要斷言的物件 / Object to assert
 * @param {boolean} [notThrow] - 若為 true 則不拋出錯誤 / If true, don't throw error
 * @throws {TypeError} 當物件沒有運算子時 / When object doesn't have an operator
 *
 * @example
 * ```typescript
 * assertHasOperator({ operator: '>=' }); // 通過 / Passes
 * assertHasOperator({ major: '1' }); // 拋出 TypeError / Throws TypeError
 * ```
 */
export declare function assertHasOperator<T extends ISimpleSemVerObjectBase>(obj: T, notThrow?: boolean): asserts obj is IHasOperator<T>;
/**
 * 檢查物件是否為 SimpleSemVer 版本物件或運算子類型
 * Check if object is a SimpleSemVer version object or operator type
 *
 * 判斷物件是否為有效的版本物件或運算子
 * Determines if object is a valid version object or operator
 *
 * @template T - 繼承自 ISimpleSemVerObjectBase 的類型 / Type extending ISimpleSemVerObjectBase
 * @param {T} obj - 要檢查的物件 / Object to check
 * @returns {boolean} 是否為版本物件或運算子類型 / Whether it's a version object or operator type
 *
 * @example
 * ```typescript
 * isSimpleSemVerObjectOrOperatorLike({ major: '1' }); // true
 * isSimpleSemVerObjectOrOperatorLike({ operator: '||' }); // true
 * isSimpleSemVerObjectOrOperatorLike({ semver: '*' }); // true (純萬用字元 / Pure wildcard)
 * isSimpleSemVerObjectOrOperatorLike({}); // false
 * ```
 */
export declare function isSimpleSemVerObjectOrOperatorLike<T extends ISimpleSemVerObjectBase>(obj: T): obj is IToSimpleSemVerObjectOrOperator<T>;
/**
 * 斷言物件為 SimpleSemVer 版本物件或運算子類型
 * Assert object is a SimpleSemVer version object or operator type
 *
 * 如果物件不是版本物件也不是運算子，拋出 TypeError
 * Throws TypeError if object is neither a version object nor an operator
 *
 * @template T - 繼承自 ISimpleSemVerObjectBase 的類型 / Type extending ISimpleSemVerObjectBase
 * @param {T} obj - 要斷言的物件 / Object to assert
 * @param {boolean} [notThrow] - 若為 true 則不拋出錯誤 / If true, don't throw error
 * @throws {TypeError} 當物件不是版本物件也不是運算子時 / When object is neither a version object nor an operator
 *
 * @example
 * ```typescript
 * assertSimpleSemVerObjectOrOperatorLike({ major: '1' }); // 通過 / Passes
 * assertSimpleSemVerObjectOrOperatorLike({ operator: '||' }); // 通過 / Passes
 * assertSimpleSemVerObjectOrOperatorLike({}); // 拋出 TypeError / Throws TypeError
 * ```
 */
export declare function assertSimpleSemVerObjectOrOperatorLike<T extends ISimpleSemVerObjectBase>(obj: T, notThrow?: boolean): asserts obj is IToSimpleSemVerObjectOrOperator<T>;
/**
 * 檢查版本是否為有效的 semver 版本
 * Check if version is a valid semver version
 *
 * 驗證版本字串是否符合 semver 規範
 * Validates if version string conforms to semver specification
 *
 * @param originalInput - 原始輸入字串 / Original input string
 * @param major - major 版本 / Major version
 * @param minor - minor 版本 / Minor version
 * @param patch - patch 版本 / Patch version
 * @param release - 預發布標籤 / Pre-release tag
 * @param build - 建置元資料 / Build metadata
 * @returns {boolean} 是否為有效版本 / Whether it's a valid version
 */
export declare function isValidVersion(originalInput: string, major: string | undefined, minor: string | undefined, patch: string | undefined, release: string | undefined, build: string | undefined): boolean;
