import { IArgvRuntime, IRuntimeInput } from './lib/types';
import { findRoot } from '@yarn-tool/find-root';
import { wsPkgListable } from 'ws-pkg-list';
import { _handleNcuArgv } from './lib/ncu-main';
import Bluebird from 'bluebird';
import { chalkByConsole, console } from 'debug-color2';
import { relative } from 'upath2';
import { _handleNcuYarnLock } from './lib/ncu-yarnlock';

export function _handleNcuArgvAuto(argv: IArgvRuntime, runtimeInput: IRuntimeInput, isWorkspace?: boolean, includeRoot?: boolean)
{
	return Bluebird.resolve()
		.then(() => findRoot(argv, true))
		// @ts-ignore
		.then<void>(async (rootData) =>
		{
			runtimeInput.console ??= console;
			runtimeInput.consoleDebug ??= console;

			if (argv.AA)
			{
				isWorkspace ??= true;
				includeRoot ??= true;
			}

			if (isWorkspace && rootData.hasWorkspace)
			{
				if (includeRoot)
				{
					await _handleNcuArgv({
						...argv,
						cwd: rootData.root,
					}, {
						...runtimeInput,
						printRootData()
						{
							chalkByConsole((chalk, console) =>
							{
								console.info([
									chalk.white(`Workspace:`),
									chalk.red(rootData.root),
								].join(' '));

							}, runtimeInput.consoleDebug);
						},
					}, isWorkspace);
				}

				return Bluebird.mapSeries(wsPkgListable(rootData.root), (row) =>
				{
					const runtime: IRuntimeInput = {
						...runtimeInput,
						printRootData()
						{
							chalkByConsole((chalk, console) =>
							{
								console.info([
									chalk.white(`Package:`),
									`${row.name}@${row.version}`,
									chalk.red(relative(rootData.root, row.location)),
								].join(' '));

							}, runtimeInput.consoleDebug);
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
