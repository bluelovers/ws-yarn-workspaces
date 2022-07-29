import { npmCheckUpdates } from '@yarn-tool/ncu';
import { writePackageJSONSync } from '@yarn-tool/write-package-json';
import { IArgvRuntime, IRuntimeInput } from './types';
import { _handleNcuYarnLock } from './ncu-yarnlock';
import { _handleRuntime } from './runtime';
import { _handleNcuResolutions } from './ncu-resolutions';
import { _handleDedupe } from './ncu-dedupe';

export async function _handleNcuArgv(argv: IArgvRuntime, runtimeInput: IRuntimeInput, isWorkspace?: boolean)
{
	const runtime = _handleRuntime(argv, runtimeInput);

	const {
		console,
		consoleDebug,
		printRootData,

		cwd,

		rootData,

		pkg_file,
		pkg_data,

		resolutions,

		pkg_file_ws,
		pkg_data_ws,

		doWorkspace,

	} = runtime;

	if (argv.resolutions)
	{
		return _handleNcuResolutions(argv, runtime);
	}

	printRootData(rootData, argv);

	const pkgNcu = await npmCheckUpdates({
		cwd,
		rootData,
		// @ts-ignore
	}, {
		...argv,
		json_old: pkg_data,
	});

	if (pkgNcu.json_changed && argv.upgrade)
	{
		writePackageJSONSync(pkg_file, pkgNcu.json_new);
		consoleDebug.info(`package.json updated`);
	}

	if (argv.dedupe && resolutions && Object.keys(resolutions).length)
	{
		if (await _handleDedupe(argv, runtime, pkgNcu))
		{
			return;
		}
	}

	!isWorkspace && await _handleNcuYarnLock(argv, runtime);
}
