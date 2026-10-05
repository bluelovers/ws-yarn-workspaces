/**
 * 依序發布尚未發布的 workspace 套件
 * Serially publish workspace packages that are not yet published
 *
 * 此模組設計為「可安全重跑」：已發布的版本會被查出並略過，
 * 因此中斷後再次執行即可續行，不需人工辨識失敗點。
 *
 * Designed to be safely re-runnable: already-published versions are detected
 * and skipped, so rerunning after an interruption continues where it left off
 * without manual triage.
 */
import { wsPkgListable } from 'ws-pkg-list';
import Bluebird from 'bluebird';
import { isPublishedByPackageJSON } from '@yarn-tool/is-published';
import { async as crossSpawn } from 'cross-spawn-extra';
import { consoleLogger as console } from 'debug-color2/logger';

/**
 * 發布 cwd 底下所有尚未發布的 workspace 套件
 * Publish all unpublished workspace packages under cwd
 *
 * @param cwd - 專案根目錄；省略時交由 wsPkgListable 決定 / Project root; omitted leaves it to wsPkgListable
 * @returns 全部套件處理完成後 resolve / Resolves once every package has been processed
 */
export async function publishRetry(cwd?: string)
{
	return Bluebird.resolve(wsPkgListable(cwd))
		/**
		 * mapSeries 而非 map：registry 對短時間大量請求會限流，
		 * 逐一發布可避免並行 publish 互相觸發 429
		 *
		 * mapSeries rather than map: the registry rate-limits bursts, and
		 * publishing one at a time avoids parallel publishes triggering 429s
		 */
		.mapSeries(async (row) => {
			const { location: cwd } = row;

			let bool = await isPublishedByPackageJSON(row);

			/**
			 * bool 為 null（套件不存在）與 false（版本不存在）都視為需發布；
			 * 只有 true（完全已發布）才跳過
			 *
			 * Both null (package missing) and false (version missing) count as
			 * needing publish; only true (fully published) is skipped
			 */
			if (!bool)
			{
				console.bgYellow.red.info(`try to publish ${row.name}@${row.version}`);

				/**
				 * 呼叫 npm CLI 而非以程式發送 HTTP：
				 * 認證、OTP、.npmrc 解析皆沿用 npm 原生行為，不需重新實作
				 *
				 * Shell out to the npm CLI instead of sending HTTP directly:
				 * auth, OTP and .npmrc handling reuse npm's native behavior
				 * rather than being reimplemented
				 */
				const cp = await crossSpawn('npm', [
					'publish',
				], {
					cwd,
					/** 繼承父程序輸出，讓使用者看到 npm 原本的進度與錯誤 / Inherit parent output so users see npm's own progress and errors */
					stdio: 'inherit',
				});

				console.log(cp.status, cp.error);

				/**
				 * 發布後固定延遲 1 秒：npm registry 對連續 publish 有速率限制，
				 * 等待可降低觸發 429 的機率
				 *
				 * Fixed 1-second delay after publishing: the npm registry
				 * rate-limits rapid publishes, and waiting lowers the chance
				 * of hitting a 429
				 */
				await Bluebird.delay(1000);
			}

		})
	;
}

/**
 * 預設匯出：此套件只有單一主要操作，具名與預設匯出等價
 * Default export: the package has one main operation, so both exports are equivalent
 */
export default publishRetry
