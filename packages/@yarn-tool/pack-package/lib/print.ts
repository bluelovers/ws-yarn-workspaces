/**
 * Created by user on 2020/4/9.
 */

import { logPacked } from '@lerna/log-packed';
import { IPackedTarballInfo } from './types';

/**
 * 以 @lerna/log-packed 印出格式化打包報表。
 * 僅轉印不自行計算（Why：報表格式與 lerna 保持一致，避免維護兩份邏輯）。
 *
 * Print a formatted packing report via @lerna/log-packed. Purely forwards the
 * data (Why: keeps the report format consistent with lerna instead of
 * maintaining a second implementation).
 *
 * @param tarball tarball 資訊 / tarball info
 */
export function printPackedTarballInfo(tarball: IPackedTarballInfo): void
{
	return logPacked(tarball)
}

/**
 * 預設匯出報表列印函式。
 *
 * Default export of the report printer.
 */
export default printPackedTarballInfo
