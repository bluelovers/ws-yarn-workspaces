/**
 * @lazy-node/semver-parse 類型定義
 * Type definitions for @lazy-node/semver-parse
 *
 * 此模組定義了 semver 解析所需的類型系統
 * This module defines the type system required for semver parsing
 *
 * @packageDocumentation
 */

import { ITSRequiredWith, ITSPickExtra, ITSPartialRecord, ITSRequiredPick  } from 'ts-type/lib/type/record';
import SimpleSemVer from './SimpleSemVer';
import { ITSToStringLiteral, ITSTypeAndStringLiteral } from 'ts-type';

/**
 * 基礎運算子列舉
 * Base operator enum
 *
 * 定義 semver 範圍運算子的基本集合
 * Defines the basic set of semver range operators
 */
export const enum EnumOperatorBase
{
	/** 相容版本 (Compatible with version) */
	TILDE = '~',
	/** 插入版本 (Caret version) */
	CARET = '^',
	/** 大於等於 (Greater than or equal) */
	GTE = '>=',
	/** 小於等於 (Less than or equal) */
	LTE = '<=',
	/** 等於 (Equal) */
	EQ = '=',
	/** 範圍 (Range) */
	HYPHEN = '-',
	/** 或 (Or) */
	OR = '||',
	/** 相容版本 (Compatible with version, alternative) */
	TILDE_ALT = '~>',
	/** 大於 (Greater than) */
	GT = '>',
	/** 小於 (Less than) */
	LT = '<',
}

export const enum EnumSemverWildcard
{
	x = 'x',
	star = '*',
}

/**
 * 基礎運算子類型
 * Base operator type
 *
 * 定義 semver 範圍運算子的基本集合
 * Defines the basic set of semver range operators
 */
// export type IOperatorBase = '~' | '^' | '>=' | '<=' | '=' | '-' | '||' | '=' | '~>' | '>' | '<';
export type IOperatorBase = ITSTypeAndStringLiteral<EnumOperatorBase>;

export type ISemverWildcard = ITSTypeAndStringLiteral<EnumSemverWildcard>;

export type ISemverNumber = ITSTypeAndStringLiteral<number>;
export type ISemverNumberString = ITSToStringLiteral<number>;

/**
 * 運算子類型
 * Operator type
 *
 * 擴展基礎運算子類型以支援自訂運算子
 * Extends base operator type to support custom operators
 */
export type IOperator = IOperatorBase | string;

export interface ISimpleSemVerObjectBaseCoreVersion
{
	major?: string | ISemverNumberString,
	minor?: string | ISemverWildcard | ISemverNumberString,
	patch?: string | ISemverWildcard | ISemverNumberString,
}

export interface ISimpleSemVerObjectBaseCoreWildcardOnly
{
	semver?: ISemverWildcard,
}

export interface ISimpleSemVerObjectBaseCoreOperator
{
	operator?: IOperator,
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
export interface ISimpleSemVerObjectBase extends ISimpleSemVerObjectBaseCoreVersion, ISimpleSemVerObjectBaseCoreOperator
{
	version?: string,
	semver?: string,
	release?: string
	build?: string
}

/**
 * SimpleSemVer 物件介面
 * SimpleSemVer object interface
 *
 * 表示一個已解析的 semver 版本物件
 * Represents a parsed semver version object
 */
export interface ISimpleSemVerObject extends IToSimpleSemVerObject<ISimpleSemVerObjectBase>
{
	semver?: string,
}

/**
 * 帶有運算子的 SimpleSemVer 物件介面
 * SimpleSemVer object with operator interface
 *
 * 表示一個包含運算子的 semver 版本物件
 * Represents a semver version object with an operator
 */
export interface ISimpleSemVerObjectWithOperator extends IHasOperator<ISimpleSemVerObject>
{

}

/**
 * SimpleSemVer 運算子介面
 * SimpleSemVer operator interface
 *
 * 表示一個純運算子物件（如 || 或 -）
 * Represents a pure operator object (e.g., || or -)
 */
export interface ISimpleSemVerOperator extends ITSPartialRecord<Exclude<keyof ISimpleSemVerObjectBase, 'operator'>, never>, ITSRequiredPick<ISimpleSemVerObjectBase, 'operator'>
{

}

/**
 * SimpleSemVer 聯合類型
 * SimpleSemVer union type
 *
 * 可能是版本物件、運算子物件或帶運算子的版本物件
 * Can be a version object, operator object, or version object with operator
 */
export type ISimpleSemVer = ISimpleSemVerObject | ISimpleSemVerOperator | ISimpleSemVerObjectWithOperator;

export type ISimpleSemVerRuntime = ISimpleSemVer | SimpleSemVer | ISimpleSemVerObjectBase;

/**
 * 具有運算子的類型標記
 * Type marker for having an operator
 *
 * 將 T 類型標記為具有 operator 屬性
 * Marks type T as having an operator property
 */
export type IHasOperator<T extends ISimpleSemVerObjectBaseCoreOperator> = T & Required<ISimpleSemVerObjectBaseCoreOperator>

/**
 * 轉換為 SimpleSemVer 運算子類型
 * Convert to SimpleSemVer operator type
 *
 * 表示一個僅包含運算子的類型
 * Represents a type containing only an operator
 */
export type IToSimpleSemVerOperator<T extends ISimpleSemVerObjectBase> = IHasOperator<T> & {
	major?: never,
}

/**
 * 轉換為 SimpleSemVer 物件類型
 * Convert to SimpleSemVer object type
 *
 * 表示一個包含主版本號的有效版本物件
 * Represents a valid version object with a major version
 */
export type IToSimpleSemVerObject<T extends ISimpleSemVerObjectBase> = T & {
	major: string,
}

/**
 * 轉換為帶運算子的 SimpleSemVer 物件類型
 * Convert to SimpleSemVer object with operator type
 *
 * 表示一個包含運算子和主版本號的版本物件
 * Represents a version object with both operator and major version
 */
export type IToSimpleSemVerObjectWithOperator<T extends ISimpleSemVerObjectBase> = IHasOperator<IToSimpleSemVerObject<T>>

/**
 * 轉換為 SimpleSemVer 物件或運算子類型
 * Convert to SimpleSemVer object or operator type
 *
 * 可能是運算子類型或版本物件類型
 * Can be either operator type or version object type
 */
export type IToSimpleSemVerObjectOrOperator<T extends ISimpleSemVerObjectBase> = IToSimpleSemVerOperator<T> | IToSimpleSemVerObject<T>

export interface IOptionsSimpleSemVerStringify
{
	removeBuild?: boolean;
	removeRelease?: boolean;
}
