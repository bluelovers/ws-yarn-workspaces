import { IArgvRuntime, IRuntimeInput } from './lib/types';
import { findRoot } from '@yarn-tool/find-root';
import { wsPkgListable } from 'ws-pkg-list';
import { _handleNcuArgv } from './lib/ncu-main';
import Bluebird from 'bluebird';
import { console } from 'debug-color2';
import { relative } from 'upath2';
import { _handleNcuYarnLock } from './lib/ncu-yarnlock';

export function _handleNcuArgvAuto(argv: IArgvRuntime, runtimeInput: IRuntimeInput, isWorkspace?: boolean)
{
	return Bluebird.resolve()
		.then(() => findRoot(argv, true))
		// @ts-ignore
		.then<void>(rootData =>
		{
			runtimeInput.console ??= console;
			runtimeInput.consoleDebug ??= console;

			if (isWorkspace && rootData.hasWorkspace)
			{
				return Bluebird.mapSeries(wsPkgListable(rootData.root), (row) =>
				{
					const runtime: IRuntimeInput = {
						...runtimeInput,
						printRootData()
						{
							runtimeInput.consoleDebug.info(`${row.name}@${row.version}`, relative(rootData.root, row.location));
						},
					};

					return _handleNcuArgv({
						...argv,
						cwd: row.location,
					}, runtime, isWorkspace)
				})
					.then(() =>
					{
						return _handleNcuYarnLock(argv, {
							...runtimeInput,
							rootData,
						})
					})
			}

			runtimeInput.printRootData ??= (rootData) =>
			{
				runtimeInput.consoleDebug.info(rootData.pkg);
			};

			return _handleNcuArgv(argv, runtimeInput)
		})
		;
}

export default _handleNcuArgvAuto
