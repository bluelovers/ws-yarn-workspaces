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

	switch (style)
	{
		case EnumVersionStyle.JetbrainsShort:
			if (disableDailyVersionSuffix)
			{
				return `${getJetbrainsYearCode(year, quarter)}.${month}.${day}`;
			}
			return `${getJetbrainsYearCode(year, quarter)}.${month}.${day}-${dailyIncrement}`;

		case EnumVersionStyle.JetbrainsShortMD:
			return `${getJetbrainsYearCode(year, quarter)}.${month * 100 + day}.${dailyIncrement}`;

		case EnumVersionStyle.StandardFull:
			if (disableDailyVersionSuffix)
			{
				return `${year}.${month}.${day}`;
			}
			return `${year}.${month}.${day}-${dailyIncrement}`;

		case EnumVersionStyle.StandardFullMD:
			return `${year}.${month * 100 + day}.${dailyIncrement}`;

		default:
			throw new Error(`Unknown version style: ${style}`);
	}
}
