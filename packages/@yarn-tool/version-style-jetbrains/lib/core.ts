/**
 * 版本字串產生核心
 * Version string generation core
 *
 * 此模組刻意不處理日期解析與預設值，只負責把已解析的年月日
 * 依照樣式格式化，方便 index.ts 與 helpers 共用同一套規則。
 * This module intentionally skips date parsing and defaulting; it only formats
 * already-parsed year/month/day by style so index.ts and helpers share one rule set.
 */
import { EnumVersionStyle } from './types';
import { getJetbrainsYearCode, getQuarterFromMonth } from './date';

/**
 * 根據樣式將日期轉換為版本字串（核心函數）
 * Convert date to version string by style (core function)
 *
 * @param style - 版本樣式 / Version style
 * @param options - 選項 / Options (year, month, day, dailyIncrement, disableDailyVersionSuffix)
 * @returns 版本字串 / Version string
 */
export function _dateToVersionByStyleCore(
	style: EnumVersionStyle,
	options: {
		year: number;
		month: number;
		day: number;
		dailyIncrement: number;
		disableDailyVersionSuffix?: boolean;
	},
): string
{
	const { year, month, day, dailyIncrement, disableDailyVersionSuffix } = options;
	const quarter = getQuarterFromMonth(month);

	/**
	 * 以 switch 而非查表：每種樣式的後綴規則不同（MD 樣式永不省略遞增號），
	 * 集中在此可避免呼叫端各自實作而產生格式不一致
	 *
	 * A switch instead of a lookup table: suffix rules differ per style
	 * (MD styles never omit the increment), keeping formats consistent for all callers
	 */
	switch (style)
	{
		case EnumVersionStyle.JetbrainsShort:
			/**
			 * 短樣式允許省略 -x 遞增後綴；這是兩種可省略樣式之一
			 *
			 * The short style may omit the -x increment suffix; one of only two styles that can
			 */
			if (disableDailyVersionSuffix)
			{
				return `${getJetbrainsYearCode(year, quarter)}.${month}.${day}`;
			}
			return `${getJetbrainsYearCode(year, quarter)}.${month}.${day}-${dailyIncrement}`;

		case EnumVersionStyle.JetbrainsShortMD:
			/**
			 * MD 樣式以「月*100+日」壓縮月日，遞增號改用點分隔以避免與月日數字混淆
			 *
			 * MD styles compress month/day as "month*100+day"; the increment is dot-separated
			 * to avoid ambiguity with the combined month-day number
			 */
			return `${getJetbrainsYearCode(year, quarter)}.${month * 100 + day}.${dailyIncrement}`;

		case EnumVersionStyle.StandardFull:
			/**
			 * 與 JetbrainsShort 同規則，差別僅在年份使用完整四位年
			 *
			 * Same rule as JetbrainsShort, except the year is a full four-digit year
			 */
			if (disableDailyVersionSuffix)
			{
				return `${year}.${month}.${day}`;
			}
			return `${year}.${month}.${day}-${dailyIncrement}`;

		case EnumVersionStyle.StandardFullMD:
			return `${year}.${month * 100 + day}.${dailyIncrement}`;

		default:
			/**
			 * 防禦性分支：此處只可能來自呼叫端傳入非列舉值，快速失敗比靜默產生錯誤版本號安全
			 *
			 * Defensive branch: only reachable when a caller passes a non-enum value;
			 * failing fast is safer than silently producing a wrong version string
			 */
			throw new Error(`Unknown version style: ${style}`);
	}
}
