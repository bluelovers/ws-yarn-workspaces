/**
 * Yarn 結構化解析工具入口
 * Yarn structured parsing utilities entry
 *
 * 提供把 resolution / descriptor 字串轉成結構化資料的能力，
 * 供 yarn-tool 其他套件共用。
 * Provides the ability to turn resolution / descriptor strings into structured data,
 * shared by other yarn-tool packages.
 *
 * @packageDocumentation
 */

import { structUtils } from '@yarnpkg/core';
import { parseResolution } from '@yarn-tool/yarnlock-parse-raw/lib/v2/parseResolution';
import { parseRange } from './lib/parseRange';
import { formatPackageName } from '@yarn-tool/pkg-name-util';

/**
 * 解析 resolution 或 descriptor 字串
 * Parse a resolution or descriptor string
 *
 * 先嘗試以 resolution 格式解析；失敗時才退回 descriptor，
 * 因為 resolution 的語法較嚴格，可作為快速的格式判別。
 * Tries the resolution format first and only falls back to descriptor when that fails,
 * because resolution syntax is stricter and thus serves as a quick format discriminator.
 *
 * @param {string} rawInput - 待解析的字串 / The string to parse
 * @returns {object | null} 解析結果，完全無法解析時回傳 null / Parse result, or null when it cannot be parsed at all
 *
 * @example
 * parseResolutionOrDescriptor('lodash@npm:^4.17.21'); // { isResolution: true, ... }
 * parseResolutionOrDescriptor('lodash@npm:4.17.21');  // { isResolution: false, ... }
 */
export function parseResolutionOrDescriptor(rawInput: string)
{
	/**
	 * resolution 分支：成功即回傳，
	 * isResolution 用 const 斷言固定為字面型別 true，讓呼叫端能做型別收窄
	 * Resolution branch: returns immediately on success;
	 * isResolution uses a const assertion to narrow to the literal type true for callers
	 */
	try
	{
		let parsed = parseResolution(rawInput);

		return {
			fullName: parsed.descriptor.fullName,
			description: parsed.descriptor.description,
			isResolution: true as const,
			parsed,
			rawInput,
		}
	}
	/**
	 * 進入 catch 代表不是 resolution 格式，
	 * 此處的例外是正常的控制流程，不會向外拋出
	 * Reaching the catch means it is not a resolution format;
	 * the exception is part of normal control flow and never propagates
	 */
	catch (e)
	{
		/**
		 * tryParseDescriptor 解析失敗時回傳 undefined 而非拋錯，
		 * 讓下方得以區分「可解析的 descriptor」與「完全無法解析」
		 * tryParseDescriptor returns undefined instead of throwing on failure,
		 * letting the code below distinguish "parsable descriptor" from "not parsable at all"
		 */
		let parsed = structUtils.tryParseDescriptor(rawInput, true);

		if (parsed)
		{
			/**
			 * descriptor 的範圍另以 parseRange 展開，
			 * 才能取出 version 等結構化欄位
			 * The descriptor's range is expanded with parseRange as well,
			 * so structured fields such as version can be read out
			 */
			let parsedRange = parseRange(parsed.range);

			return {
				fullName: formatPackageName(parsed),
				description: parsedRange.params?.version,
				isResolution: false as const,
				parsed,
				parsedRange,
				rawInput,
			}
		}
	}

	/**
	 * 兩種格式皆失敗：以 null 表達「不是有效輸入」，
	 * 讓呼叫端能用單一 null 檢查批量處理清單
	 * Both formats failed: null expresses "not a valid input",
	 * so callers can process a list with a single null check
	 */
	return null;
}
