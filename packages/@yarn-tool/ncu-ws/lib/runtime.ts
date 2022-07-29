import { IArgvRuntime, IRuntime, IRuntimeInput } from './types';
import { findRoot } from '@yarn-tool/find-root';
import { join } from 'upath2';
import { readPackageJson } from '@ts-type/package-dts';
import { IPackageJson } from '@ts-type/package-dts/package-json';

export function _handleRuntime(argv: IArgvRuntime, runtimeInput: IRuntimeInput)
{
	const { cwd } = argv;

	const rootData = findRoot({
		...argv,
		cwd,
	}, true);

	let pkg_file = join(rootData.pkg, 'package.json');
	let pkg_data = readPackageJson(pkg_file);

	let resolutions = pkg_data.resolutions;

	let pkg_file_ws: string;
	let pkg_data_ws: IPackageJson;

	let doWorkspace = !rootData.isWorkspace && rootData.hasWorkspace;

	if (doWorkspace)
	{
		pkg_file_ws = join(rootData.ws, 'package.json');
		pkg_data_ws = readPackageJson(pkg_file_ws);

		resolutions = pkg_data_ws.resolutions;
	}

	return {
		...runtimeInput,

		cwd,

		rootData,

		pkg_file,
		pkg_data,

		resolutions,

		pkg_file_ws,
		pkg_data_ws,

		doWorkspace,
	}
}
