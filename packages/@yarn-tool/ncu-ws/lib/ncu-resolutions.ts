/**
 * resolutions 專用處理流程 (resolutions-only flow)
 * 說明：當 `--resolutions`（`-R`）被指定時，本模組取代一般的依賴更新流程：
 * 讀取 yarn.lock → 檢查 resolutions 的可更新版本 → 顯示差異表 →
 * 僅在 `--upgrade` 時寫回 package.json 與 yarn.lock。
 * Why: with `--resolutions` (`-R`) this module replaces the regular dependency
 * update flow: read yarn.lock → check updatable versions for resolutions → print
 * the diff table → write package.json and yarn.lock only under `--upgrade`.
 *
 * @module ncu-resolutions
 */
import { IArgvRuntime, IRuntime } from './types';
import { checkResolutionsUpdate, isUpgradeable, npmCheckUpdatesOptions, updateSemver } from '@yarn-tool/ncu';
import { yargsProcessExit } from '@yarn-tool/yargs-util';
import { chalkByConsole } from 'debug-color2';
import { relative } from 'upath2';
import { toDependencyTable } from '@yarn-tool/table';
import { writePackageJSONSync } from '@yarn-tool/write-package-json';
import { yarnLockStringify } from '@yarn-tool/yarnlock-stringify';
import { fsYarnLockSafe } from '@yarn-tool/yarnlock-fs/lib/read';
import { yarnLockDiff } from '@yarn-tool/yarnlock-diff';
import { writeYarnLockFile } from '@yarn-tool/yarnlock-fs/lib/writeYarnLockFile';

/**
 * 檢查並更新 resolutions (Check and update resolutions)
 *
 * 順序刻意安排為「先寫 yarn.lock、再寫 package.json」：
 * 若沒有 resolutions 或 yarn.lock，會直接結束並提示，避免留下半完成的狀態。
 * yarn.lock is written before package.json on purpose; when resolutions or the
 * yarn.lock are missing the process exits early with a message, so no half-applied
 * state can be left behind.
 *
 * @param argv - 命令列參數（含 `upgrade`、`cwd`） / CLI arguments (including `upgrade`, `cwd`)
 * @param runtime - 由 `_handleRuntime` 建立的執行時期環境 / Runtime environment built by `_handleRuntime`
 */
export async function _handleNcuResolutions(argv: IArgvRuntime, runtime: IRuntime)
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

	/**
	 * 沒有任何 resolutions 就沒有可檢查的對象，直接以錯誤碼結束
	 * Without resolutions there is nothing to check, so exit with an error
	 */
	if (!resolutions || !Object.keys(resolutions).length)
	{
		return yargsProcessExit(`resolutions aren't exists in package.json`)
	}

	const yl = fsYarnLockSafe(rootData.root);

	/**
	 * yarn.lock 缺少時沒有可比對的基準，直接返回不做事
	 * Without a yarn.lock there is no baseline to diff against, so do nothing
	 */
	if (!yl.yarnlock_old)
	{
		// 防止 yarn.lock 不存在
		return;
	}

	const ret = await checkResolutionsUpdate(resolutions, yl.yarnlock_old, argv as any);

	//console.log(ret);

	/**
	 * lock 有變動時先寫入並印出差異，讓使用者在處理 package.json 之前
	 * 就能看到 resolutions 的實際變化
	 * When the lock changed, write it and print the diff first so the user sees the
	 * actual resolution changes before package.json is touched
	 */
	if (ret.yarnlock_changed)
	{
		writeYarnLockFile(yl.yarnlock_file, ret.yarnlock_new_obj);

		chalkByConsole((chalk, console) =>
		{
			const p = chalk.cyan(relative(argv.cwd, yl.yarnlock_file));

			console.log(`${p} is updated!`);

		}, console);

		const msg = yarnLockDiff(yarnLockStringify(ret.yarnlock_old_obj), yarnLockStringify(ret.yarnlock_new_obj));

		if (msg)
		{
			console.log(`\n${msg}\n`);
		}
	}

	/**
	 * 只保留「真的可以升級」的項目（過濾掉版本關鍵字與無效組合），
	 * 避免表格出現無法套用的更新
	 * Keep only genuinely upgradeable entries (strategy keywords and invalid
	 * combinations are filtered out) so the table never shows unusable updates
	 */
	const ls2 = Object.values(ret.deps)
		.filter(data =>
		{

			const { name, version_old, version_new } = data;

			return isUpgradeable(version_old, version_new)
		})
	;

	const ncuOptions = npmCheckUpdatesOptions(argv as any);

	/**
	 * 依 semver 規則產生新的版本宣告，同時更新表格資料與 `resolutions` 本身；
	 * 這裡直接改動 `resolutions`，因此後續寫檔會帶上最新值。
	 * Produce new version declarations per semver rules, updating both the table
	 * data and `resolutions` itself; the in-place change is what the later write
	 * picks up.
	 */
	const fromto = ls2
		.reduce((a, data) =>
		{
			const { name, version_old, version_new } = data;

			const new_semver = updateSemver(version_old, version_new, ncuOptions);

			a.from[name] = version_old;
			a.to[name] = new_semver;

			resolutions[name] = new_semver;

			return a;
		}, {
			from: {},
			to: {},
		} as Parameters<typeof toDependencyTable>[0])
	;

	const msg = toDependencyTable(fromto);

	console.log(`\n${msg}\n`);

	/**
	 * 沒有 --upgrade 就只輸出報告，不寫入任何檔案
	 * Without --upgrade only the report is printed; nothing is written
	 */
	if (argv.upgrade)
	{
		/**
		 * workspace 根模式下，resolutions 屬於根套件，必須寫回根套件的 package.json
		 * In workspace-root mode resolutions belong to the root, so write the root's
		 * package.json
		 */
		if (doWorkspace)
		{
			pkg_data_ws.resolutions = resolutions;

			writePackageJSONSync(pkg_file_ws, pkg_data_ws);

			chalkByConsole((chalk, console) =>
			{
				const p = chalk.cyan(relative(argv.cwd, pkg_file_ws));

				console.log(`${p} is updated!`);

			}, console);
		}
		else
		{
			pkg_data.resolutions = resolutions;

			writePackageJSONSync(pkg_file, pkg_data);

			chalkByConsole((chalk, console) =>
			{

				const p = chalk.cyan(relative(rootData.ws || rootData.pkg, pkg_file));

				console.log(`${p} is updated!`);

			}, console);
		}

	}
}
