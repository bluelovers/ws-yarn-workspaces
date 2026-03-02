/**
 * yarn.lock 檔案處理模組 / yarn.lock file processing module
 *
 * 負責檢查和更新 yarn.lock 檔案中的依賴版本標記
 * Responsible for checking and updating dependency version tags in yarn.lock files
 */

import { fsYarnLockSafe } from '@yarn-tool/yarnlock-fs/lib/read';
import { printReport, updateYarnLockTag } from '@yarn-tool/yarnlock-ncu';
import { writeFileSync } from 'fs-extra';
import { IArgvRuntime, IRuntime, IRuntimeInput } from './types';

/**
 * 處理 yarn.lock 檔案的 ncu 更新
 * Process ncu updates for yarn.lock file
 *
 * 此函數會：
 * - 檢查 yarn.lock 是否存在
 * - 比對 registry 上的新版本
 * - 輸出更新報告
 * - 根據 upgrade 參數決定是否寫入檔案
 *
 * This function will:
 * - Check if yarn.lock exists
 * - Compare with newer versions on registry
 * - Output update report
 * - Decide whether to write file based on upgrade parameter
 *
 * @param argv - 命令列參數 / Command line arguments
 * @param runtime - 執行時期環境資訊（包含 rootData 和 console）/ Runtime environment info (contains rootData and console)
 */
export async function _handleNcuYarnLock(argv: IArgvRuntime, runtime: Pick<IRuntime, 'rootData' | 'consoleDebug' | 'console'>,)
{
	const { rootData, consoleDebug, console } = runtime;

	/**
	 * 安全讀取 yarn.lock 檔案資訊
	 * Safely read yarn.lock file information
	 */
	const yl = fsYarnLockSafe(rootData.root);

	/**
	 * 僅當 yarn.lock 存在時才進行處理
	 * Only process when yarn.lock exists
	 */
	if (yl.yarnlock_exists)
	{
		/**
		 * 檢查並更新 yarn.lock 中的版本標記
		 * Check and update version tags in yarn.lock
		 */
		const ret = await updateYarnLockTag(yl.yarnlock_old);

		/**
		 * 如果有變更，輸出報告並根據參數決定是否更新檔案
		 * If there are changes, output report and decide whether to update file based on parameters
		 */
		if (ret.yarnlock_changed)
		{
			consoleDebug.magenta.info(`higher versions exists on registry`);

			/**
			 * 輸出更新報告表格
			 * Output update report table
			 */
			const s = printReport(ret.report);
			s?.length > 0 && console.log(s);

			/**
			 * 根據 upgrade 參數決定是否寫入更新後的 yarn.lock
			 * Decide whether to write updated yarn.lock based on upgrade parameter
			 */
			if (argv.upgrade)
			{
				writeFileSync(yl.yarnlock_file, ret.yarnlock_new);
				consoleDebug.magenta.info(`yarn.lock updated`);
				consoleDebug.log(`you can do `, console.bold.cyan.chalk(`yt install`), ` , for upgrade dependencies now`);
			}
			else
			{
				consoleDebug.log(`you can do `, console.bold.cyan.chalk(`yt ncu -u`), ` , for update yarn.lock`);
			}
		}
	}
}
