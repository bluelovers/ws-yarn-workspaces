import { analyzeVersionStyles, dateToVersionByStyle } from '@yarn-tool/version-style-jetbrains';

/**
 * 固定化的基準日期時間
 *
 * 風格版本的日期時間取自執行當下，直接快照會隨時間變動，
 * 所有需要固定的產生結果都以這組基準重繪
 */
export const FIXED_DATE = {
	year: 2026,
	month: 11,
	day: 20,
	hour: 17,
	minute: 44,
};

/**
 * 將產生結果中的變動日期時間換成固定基準，保留樣式、遞增號與 preid
 *
 * 作法：拆出 preid 尾段（風格解析不支援 preid）→ 以 `analyzeVersionStyles`
 * 取得樣式與遞增號 → 用 `FIXED_DATE` 重繪本體 → 接回尾段，
 * 讓快照只反映樣式與結構差異。
 * 非風格版本（semver）本身即固定，原樣回傳。
 *
 * @param version - 產生結果
 * @returns 固定化的版本字串
 */
export function toFixedVersion(version: string): string
{
	/** preid 尾段（如 -beta、-beta.1）：風格格式不解析，先拆出於固定化後接回 */
	const preid = version.match(/-[A-Za-z][\w.]*$/)?.[0] ?? '';
	const body = preid ? version.slice(0, -preid.length) : version;

	const { priorityStyle, priorityResult } = analyzeVersionStyles(body);

	/** 非風格版本（如 semver）不隨時間變動，原樣保留 */
	if (!priorityStyle || !priorityResult)
	{
		return version;
	}

	/** 尾段為 `-n` 時屬遞增號，交由樣式重繪；沒有尾段代表原本就停用了遞增後綴 */
	const hasIncrementSuffix = /-\d+$/.test(body);

	const fixedBody = dateToVersionByStyle(priorityStyle, {
		...FIXED_DATE,
		dailyIncrement: priorityResult.dailyVersion,
		disableDailyVersionSuffix: !hasIncrementSuffix,
	});

	return `${fixedBody}${preid}`;
}
