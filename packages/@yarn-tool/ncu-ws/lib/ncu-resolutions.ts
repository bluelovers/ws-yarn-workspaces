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

	if (!resolutions || !Object.keys(resolutions).length)
	{
		return yargsProcessExit(`resolutions aren't exists in package.json`)
	}

	const yl = fsYarnLockSafe(rootData.root);

	if (!yl.yarnlock_old)
	{
		// 防止 yarn.lock 不存在
		return;
	}

	const ret = await checkResolutionsUpdate(resolutions, yl.yarnlock_old, argv as any);

	//console.log(ret);

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

	const ls2 = Object.values(ret.deps)
		.filter(data =>
		{

			const { name, version_old, version_new } = data;

			return isUpgradeable(version_old, version_new)
		})
	;

	const ncuOptions = npmCheckUpdatesOptions(argv as any);

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

	if (argv.upgrade)
	{
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
