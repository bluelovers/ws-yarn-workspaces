/**
 * resolutions 去重流程 (Resolutions dedupe flow)
 * 說明：當 `--dedupe` 啟用且套件有 resolutions 時，本模組會檢查依賴版本與
 * resolutions 是否已經不一致，並在 `--upgrade` 下把 yarn.lock 整併成單一版本。
 * Why: when `--dedupe` is on and the package has resolutions, this module checks
 * whether dependency versions have drifted from the resolutions, and under
 * `--upgrade` collapses yarn.lock into a single version.
 *
 * @module ncu-dedupe
 */
import { IArgvRuntime, IRuntime } from './types';
import { IDependencies } from '@ts-type/package-dts/package-json';
import { checkResolutionsUpdate, npmCheckUpdates } from '@yarn-tool/ncu';
import { yarnLockStringify } from '@yarn-tool/yarnlock-stringify';
import { fsYarnLockSafe } from '@yarn-tool/yarnlock-fs/lib/read';
import { yarnLockDiff } from '@yarn-tool/yarnlock-diff';
import { writeYarnLockFile } from '@yarn-tool/yarnlock-fs/lib/writeYarnLockFile';

/**
 * 檢查依賴與 resolutions 的落差並去重 yarn.lock (Diff dependencies against resolutions and dedupe yarn.lock)
 *
 * 回傳值含意：回傳 `true` 表示「已處理完成、呼叫端不必再更新 yarn.lock」
 * （目前僅在 yarn.lock 不存在時如此）；其餘情況回傳 undefined，
 * 由呼叫端 `_handleNcuArgv` 接手一般的 yarn.lock 更新。
 * Return semantics: `true` means "handled, the caller must not touch yarn.lock
 * again" (currently only when the lock file is missing); otherwise it returns
 * undefined and `_handleNcuArgv` proceeds with the regular yarn.lock update.
 *
 * 邊界情況：開頭的 `reduce` 會算出「依賴版本 → resolutions」的對照，但其結果
 * 未被指派使用；這段既有的程式碼只保留行為（`latest` 會先轉成 `*`），
 * 此處僅記錄現況，不做改動。
 * Edge case: the leading `reduce` builds a dependency→resolution mapping whose
 * result is never assigned; this existing code only preserves the behaviour
 * (`latest` is first turned into `*`) and is documented, not changed.
 *
 * @param argv - 命令列參數（含 `upgrade`） / CLI arguments (including `upgrade`)
 * @param runtime - 由 `_handleRuntime` 建立的執行時期環境 / Runtime environment built by `_handleRuntime`
 * @param pkgNcu - `npmCheckUpdates` 的檢查結果 / The result of `npmCheckUpdates`
 */
export async function _handleDedupe(argv: IArgvRuntime,
	runtime: IRuntime,
	pkgNcu: Awaited<ReturnType<typeof npmCheckUpdates>>,
)
{
	const {
		consoleDebug,
		console,

		cwd,

		rootData,

		pkg_file,
		pkg_data,

		resolutions,

		pkg_file_ws,
		pkg_data_ws,

		doWorkspace,

	} = runtime;

	Object.entries(pkgNcu.json_new.dependencies || {})
		.concat(Object.entries(pkgNcu.json_new.devDependencies || {}), Object.entries(pkgNcu.json_new.optionalDependencies || {}))

		/**
		 * 只取「原本就寫在 resolutions 中」的依賴；`latest` 不是合法範圍，先還原成 `*`
		 * Only dependencies already listed in resolutions are considered; `latest` is
		 * not a valid range, so it is normalised back to `*`
		 */
		.reduce(function (a, [name, ver_new])
		{
			const ver_old = resolutions[name];

			if (ver_old)
			{
				if (ver_new === 'latest')
				{
					ver_new = '*';
				}

				// @ts-ignore
				a[name] = ver_new;
			}

			return a;
		}, {} as IDependencies)
	;

	const yl = fsYarnLockSafe(rootData.root);

	/**
	 * yarn.lock 缺少時沒有可去重的對象；
	 * 回傳 true 會讓呼叫端略過它自己的 yarn.lock 更新步驟
	 * Without a yarn.lock there is nothing to dedupe; returning true makes the
	 * caller skip its own yarn.lock step as well
	 */
	if (!yl.yarnlock_old)
	{
		// 防止 yarn.lock 不存在
		return true;
	}

	const ret = await checkResolutionsUpdate(resolutions, yl.yarnlock_old, argv as any);

	/**
	 * 有差異時先印出差異報告（尚未寫檔）
	 * When there is a difference, print the report first (nothing written yet)
	 */
	if (ret.yarnlock_changed)
	{
		const msg = yarnLockDiff(yarnLockStringify(ret.yarnlock_old_obj), yarnLockStringify(ret.yarnlock_new_obj));

		if (msg)
		{
			console.log(`\n${msg}\n`);
		}
	}

	/**
	 * 未指定 --upgrade 時只給予提示，讓使用者決定是否真的更新
	 * Without --upgrade only a hint is printed, leaving the actual update to the user
	 */
	if (pkgNcu.json_changed && !argv.upgrade)
	{
		ret.yarnlock_changed && consoleDebug.magenta.info(`your dependencies version high than resolutions`);
		consoleDebug.log(`you can do `, console.bold.cyan.chalk(`yt ncu -u`), ` , for update package.json`);
	}

	/**
	 * 指定 --upgrade 才把去重後的 yarn.lock 寫回
	 * Only with --upgrade is the deduplicated yarn.lock written back
	 */
	if (ret.yarnlock_changed && argv.upgrade)
	{
		writeYarnLockFile(yl.yarnlock_file, ret.yarnlock_new_obj);

		consoleDebug.magenta.info(`Deduplication yarn.lock`);
		consoleDebug.log(`you can do `, console.bold.cyan.chalk(`yt install`), ` , for upgrade dependencies now`);
	}
}
