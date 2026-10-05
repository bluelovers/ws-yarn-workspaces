/**
 * Yarn 範圍解析 (Range Parsing) 的型別化包裝
 * Typed wrapper around Yarn range parsing
 *
 * 轉呼叫 @yarnpkg/core 的 structUtils.parseRange，
 * 並透過條件型別讓回傳值隨選項收窄，
 * 使呼叫端在要求必填欄位時不必再手動斷言。
 * Delegates to structUtils.parseRange from @yarnpkg/core and narrows the return type
 * conditionally on the given options, so callers never need manual assertions for required fields.
 *
 * @module @yarn-tool/yarn-struct-utils/lib/parseRange
 */

import { ParsedUrlQuery } from 'querystring';
import { structUtils } from '@yarnpkg/core';

/**
 * 範圍解析選項
 * Range parsing options
 */
export type IParseRangeOptions = {
	/** 缺少 bindings 時拋出錯誤 / Throw an error if bindings are missing */
	requireBindings?: boolean;
	/** 缺少 protocol 或與指定值不符時拋出錯誤 / Throw an error if the protocol is missing or is not the specified one */
	requireProtocol?: boolean | string;
	/** 缺少 source 時拋出錯誤 / Throw an error if the source is missing */
	requireSource?: boolean;
	/** 是否以查詢字串格式解析 selector / Whether to parse the selector as a query string */
	parseSelector?: boolean;
};

/**
 * 回傳值核心型別：依各選項是否設定，決定對應欄位為必填或可為 null
 * Core return type: per option, decides whether the matching field is required or nullable
 *
 * 以條件型別交叉組合而非單一物件型別，
 * 是為了讓 requireBindings: true 能精確推導出非 null 的 params。
 * The conditional intersection (rather than one flat object type) exists so that
 * requireBindings: true precisely infers a non-null params.
 */
type I_ParseRangeReturnTypeCore<Opts extends IParseRangeOptions> = ({
	params: Opts extends {
		requireBindings: true;
	} ? ParsedUrlQuery : ParsedUrlQuery | null;
}) & ({
	protocol: Opts extends {
		requireProtocol: true | string;
	} ? string : string | null;
}) & ({
	source: Opts extends {
		requireSource: true;
	} ? string : string | null;
}) & ({
	selector: Opts extends {
		parseSelector: true;
	} ? ParsedUrlQuery : string;
});

/**
 * 完整回傳型別，在核心型別之上附加 Yarn 特有的參數欄位
 * Full return type: the core type plus the Yarn-specific parameter fields
 */
export type IParseRangeReturnType<Opts extends IParseRangeOptions> = I_ParseRangeReturnTypeCore<Opts> & {
	params?: {
		/** 版本字串 / Version string */
		version?: string,
		/** 雜湊值 / Hash value */
		hash?: string,
		/** 定位子 (Locator) 字串 / Locator string */
		locator?: string,
	}
}

/**
 * 擴充 @yarnpkg/core 的 structUtils，補上此套件的型別定義
 * Augments @yarnpkg/core's structUtils with this package's type definition
 *
 * @yarnpkg/core 原本的 parseRange 回傳 any，此擴充讓既有程式碼
 * 在不改寫呼叫方式的前提下取得精確型別。
 * @yarnpkg/core's original parseRange returns any; this augmentation gives existing code
 * precise types without changing how it is called.
 */
declare module '@yarnpkg/core/lib/structUtils'
{
	function parseRange<Opts extends IParseRangeOptions>(range: string, opts?: Opts): IParseRangeReturnType<Opts>
}

/**
 * 解析 Yarn 範圍字串
 * Parse a Yarn range string
 *
 * @param {string} range - 範圍字串，例如 `npm:4.17.21` / Range string, e.g. `npm:4.17.21`
 * @param {IParseRangeOptions} [opts] - 驗證與解析選項 / Validation and parsing options
 * @returns {IParseRangeReturnType<Opts>} 依選項收窄後的解析結果 / Parse result narrowed by the given options
 *
 * @example
 * parseRange('npm:4.17.21', { requireProtocol: 'npm' }).protocol; // 'npm'
 */
export function parseRange<Opts extends IParseRangeOptions>(range: string, opts?: Opts): IParseRangeReturnType<Opts>
{
	/**
	 * 純轉呼叫：所有語法細節都交給 @yarnpkg/core，
	 * 本套件只負責型別，避免兩份實作日後偏離
	 * Pure delegation: all syntax details live in @yarnpkg/core,
	 * while this package only owns the types so the two implementations never drift apart
	 */
	return structUtils.parseRange(range, opts)
}
