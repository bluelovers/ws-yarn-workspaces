import { Options, Range, RangeOptions } from 'semver';
import semverRange from 'semver/classes/range';
import SemVer from 'semver/classes/semver';
import SemverRange from './Range';
import { ITSArrayListMaybeReadonly } from 'ts-type/lib/type/base';
import Comparator from 'semver/classes/comparator';

/**
 * 套件選項介面
 * Package options interface
 *
 * 繼承 semver 的 Options 與 RangeOptions，再加上本套件特有的兩個開關。
 * Extends semver's `Options` and `RangeOptions`, plus two switches unique to
 * this package.
 */
export interface IOptions extends Options, RangeOptions
{
	/** 停用 ampersand (`&`) 支援，此時 `&` 會被當成無效字元 / Disable ampersand (`&`) support; `&` then counts as an invalid character */
	noAmpersand?: boolean,

	/** 啟用不安全的比較器集合最佳化，可能改變邊界行為 / Enable unsafe comparator-set optimization; may alter edge behavior */
	unsafeOptimize?: boolean,
}

/**
 * 選項或寬鬆旗標
 * Options or loose flag
 *
 * 允許直接傳布林值作為 { loose } 的簡寫，與原生 semver 的呼叫習慣一致。
 * Allows a boolean shorthand for `{ loose }`, matching native semver call
 * conventions.
 */
export type IOptionsOrLoose<T extends Options = IOptions> = boolean | T

/** 比較器集合型別（沿用 semver Range 的 set）/ Comparator set type (mirrors semver Range's `set`) */
export type IComparatorSet = Range["set"];

/** 可為唯讀的比較器陣列 / Comparator array, possibly read-only */
export type IComparatorArrayInput = ITSArrayListMaybeReadonly<Comparator>;

/** 可為唯讀的比較器陣列之集合 / A set of comparator arrays, possibly read-only */
export type IComparatorSetInput = ITSArrayListMaybeReadonly<IComparatorArrayInput>;

/**
 * 可接受的範圍輸入型別
 * Accepted range input types
 *
 * 涵蓋字串、本套件的 Range、原生 Range、SemVer 與單一 Comparator，
 * 對應 Range 建構函式 _inherit 中的各個分支。
 * Covers a string, this package's Range, a native Range, a SemVer, and a
 * single Comparator — one for each branch handled by Range's `_inherit`.
 */
export type ISemverRangeInput = string | SemverRange<any> | semverRange | SemVer | Comparator;
