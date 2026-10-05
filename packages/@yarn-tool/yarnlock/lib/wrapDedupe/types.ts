import { ITSResolvable, ITSWriteablePick, ITSWriteableWith } from 'ts-type';
import { IWrapDedupeCache } from '../types';
import { Arguments, Argv } from 'yargs';
import { Console2 } from 'debug-color2';

/**
 * `IWrapDedupeCache` 的執行期 (Runtime) 版本：
 * 把管線內部才會賦值的欄位放寬為可寫入，讓實作端能更新快取，
 * 使用端仍透過 `IWrapDedupeCache` 只讀地檢視快取。
 *
 * Runtime variant of `IWrapDedupeCache`: widens pipeline-owned fields to writable so the
 * implementation can update the cache, while consumers keep viewing it read-only through
 * `IWrapDedupeCache`.
 */
export interface IWrapDedupeCacheRuntime extends Omit<ITSWriteableWith<IWrapDedupeCache, 'cwd' | 'rootData' | 'yarnlock_old' | 'yarnlock_old_exists' | 'ret' | 'consoleDebug' | 'console'>, 'ret'>
{
	/**
	 * `ret` 以可寫入版本替換，供各步驟逐一記錄狀態
	 */
	ret: ITSWriteablePick<IWrapDedupeCache["ret"]>
}

/**
 * `wrapDedupe` 管線的步驟 (Step) 設定：
 * 各步驟依序執行，回傳 truthy 即中斷後續步驟。
 *
 * Step options for the `wrapDedupe` pipeline: steps run in order and any truthy
 * return aborts the remaining steps.
 */
export interface IWrapDedupeOptions<T extends {
	cwd?: string,
	[k: string]: unknown,
}, U extends T | {
	cwd: string,
	[k: string]: unknown,
}, C extends IWrapDedupeCache>
{

	/**
	 * 如果初始化沒有發生錯誤 此步驟必定執行
	 */
	init?(yarg: Argv<T>, argv: Arguments<U>, cache: C): ITSResolvable<boolean | void>;

	/**
	 * 於 第一次 Dedupe 前的步驟
	 */
	before?(yarg: Argv<T>, argv: Arguments<U>, cache: C): ITSResolvable<boolean | void>;

	/**
	 * 此步驟為必要選項
	 */
	main(yarg: Argv<T>, argv: Arguments<U>, cache: C): ITSResolvable<boolean | void>;

	/**
	 * 於 第二次 Dedupe 後的步驟
	 */
	after?(yarg: Argv<T>, argv: Arguments<U>, cache: C): ITSResolvable<boolean | void>;

	/**
	 * 於 第二次 Dedupe 後的步驟
	 */
	after?(yarg: Argv<T>, argv: Arguments<U>, cache: C): ITSResolvable<boolean | void>;

	/**
	 * 如果結束前沒有發生錯誤 此步驟必定執行
	 */
	end?(yarg: Argv<T>, argv: Arguments<U>, cache: C): ITSResolvable<boolean | void>;

	/**
	 * 步驟間共享的緩存資訊並且會影響部分行為
	 */
	cache?: Partial<C>;

	/**
	 * 除錯輸出用的 console；未提供時由 handleWrapDedupeOptions 套用預設值
	 */
	consoleDebug: Console2;
}
