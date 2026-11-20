import { EnumVersionStyle } from './types';
import {
	_formatTimeToHHmm,
	getMonthDayCode,
	getY2KDateTimeYearCode,
	getJetbrainsYearCode,
	getQuarterFromMonth,
} from './date';
import {
	ISegVerDailyVersionIncrementNumber,
	ISegDayNumber,
	ISegMonthNumber,
	ISegTimeHourNumber,
	ISegTimeMinuteNumber,
	ISegYearNumber,
} from './types-seg';

/**
 * 根據樣式將日期轉換為版本字串（核心函數）
 *
 * @param style - 版本樣式
 * @param options - 選項
 * @returns 版本字串
 */
export function _dateToVersionByStyleCore(
	style: EnumVersionStyle,
	options: {
		year: ISegYearNumber;
		month: ISegMonthNumber;
		day: ISegDayNumber;
		dailyIncrement: ISegVerDailyVersionIncrementNumber;
		disableDailyVersionSuffix?: boolean;
		hour?: ISegTimeHourNumber;
		minute?: ISegTimeMinuteNumber;
	},
): string
{
	const { year, month, day, dailyIncrement, disableDailyVersionSuffix, hour = 0, minute = 0 } = options;
	const quarter = getQuarterFromMonth(month);

	/**
	 * 以 switch 而非查表：每種樣式的後綴規則不同（MD 樣式永不省略遞增號），
	 * 集中在此可避免呼叫端各自實作而產生格式不一致
	 */
	switch (style)
	{
		case EnumVersionStyle.JetbrainsShort:
			/**
			 * 短樣式允許省略 -x 遞增後綴；這是兩種可省略樣式之一
			 */
			if (disableDailyVersionSuffix)
			{
				return `${getJetbrainsYearCode(year, quarter)}.${month}.${day}`;
			}
			return `${getJetbrainsYearCode(year, quarter)}.${month}.${day}-${dailyIncrement}`;

		case EnumVersionStyle.JetbrainsShortMD:
			/**
			 * MD 樣式以「月*100+日」壓縮月日，遞增號改用點分隔以避免與月日數字混淆
			 */
			return `${getJetbrainsYearCode(year, quarter)}.${getMonthDayCode(month, day)}.${dailyIncrement}`;

		case EnumVersionStyle.StandardFull:
			/**
			 * 與 JetbrainsShort 同規則，差別僅在年份使用完整四位年
			 */
			if (disableDailyVersionSuffix)
			{
				return `${year}.${month}.${day}`;
			}
			return `${year}.${month}.${day}-${dailyIncrement}`;

		case EnumVersionStyle.StandardFullMD:
			return `${year}.${getMonthDayCode(month, day)}.${dailyIncrement}`;

		case EnumVersionStyle.Y2KDateTime:
		{
			/**
			 * 時間以 HHmm 固定四碼取代其他樣式的遞增段位置，
			 * 遞增號退回為可省略的 -x 後綴（與 JetbrainsShort 同規則）
			 */
			const timeVersion = `${getY2KDateTimeYearCode(year)}.${getMonthDayCode(month, day)}.${_formatTimeToHHmm(hour, minute)}`;

			if (disableDailyVersionSuffix)
			{
				return timeVersion;
			}
			return `${timeVersion}-${dailyIncrement}`;
		}

		default:
			/**
			 * 防禦性分支：此處只可能來自呼叫端傳入非列舉值，快速失敗比靜默產生錯誤版本號安全
			 */
			throw new Error(`Unknown version style: ${style}`);
	}
}
