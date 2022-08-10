import { IArgvRuntime, IRuntime } from './types';
import { IDependencies } from '@ts-type/package-dts/package-json';
import { checkResolutionsUpdate, npmCheckUpdates } from '@yarn-tool/ncu';
import { yarnLockStringify } from '@yarn-tool/yarnlock-stringify';
import { fsYarnLockSafe } from '@yarn-tool/yarnlock-fs/lib/read';
import { yarnLockDiff } from '@yarn-tool/yarnlock-diff';
import { writeYarnLockFile } from '@yarn-tool/yarnlock-fs/lib/writeYarnLockFile';

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

	if (!yl.yarnlock_old)
	{
		// 防止 yarn.lock 不存在
		return true;
	}

	const ret = await checkResolutionsUpdate(resolutions, yl.yarnlock_old, argv as any);

	if (ret.yarnlock_changed)
	{
		const msg = yarnLockDiff(yarnLockStringify(ret.yarnlock_old_obj), yarnLockStringify(ret.yarnlock_new_obj));

		if (msg)
		{
			console.log(`\n${msg}\n`);
		}
	}

	if (pkgNcu.json_changed && !argv.upgrade)
	{
		ret.yarnlock_changed && consoleDebug.magenta.info(`your dependencies version high than resolutions`);
		consoleDebug.log(`you can do `, console.bold.cyan.chalk(`yt ncu -u`), ` , for update package.json`);
	}

	if (ret.yarnlock_changed && argv.upgrade)
	{
		writeYarnLockFile(yl.yarnlock_file, ret.yarnlock_new_obj);

		consoleDebug.magenta.info(`Deduplication yarn.lock`);
		consoleDebug.log(`you can do `, console.bold.cyan.chalk(`yt install`), ` , for upgrade dependencies now`);
	}
}
