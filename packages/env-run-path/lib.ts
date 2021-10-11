import { resolve, delimiter } from "path";
import { findRoot } from '@yarn-tool/find-root';
import { findBinPathCore } from './core';
import { IOptionsGetRunPathCore, IOptionsFindBinPath, ProcessEnv } from './index';
import { envPathKey, processEnv as _processEnv } from '@yarn-tool/env-path/index';

export function findBinPath(options: IOptionsFindBinPath = {})
{
	let {
		cwd = process.cwd(),
		stopPath,
	} = options;

	if (!options.cwd || typeof stopPath === 'boolean' || !stopPath)
	{
		let rootData = findRoot({
			cwd,
		});

		if (stopPath === true || stopPath == null)
		{
			stopPath = [rootData.root]
		}
		else if (!stopPath)
		{
			stopPath = [];
		}

		if (!options.cwd)
		{
			cwd = rootData.pkg;
		}
	}

	let { history, result } = findBinPathCore({
		...options,
		cwd,
		stopPath,
	});

	return {
		result,
		history,
	}
}

export function getExePath(options: IOptionsGetRunPathCore)
{
	let {
		cwd = process.cwd(),
		execPath = process.execPath,
	} = options;

	return resolve(cwd, execPath, '..')
}

export function processRunPathCore<P = ProcessEnv>(options: IOptionsGetRunPathCore<P> = {})
{
	let processEnv = (options.processEnv || _processEnv()) as any as P;
	const pathKey = envPathKey(processEnv);

	let {
		cwd = process.cwd(),
		execPath = process.execPath,
		envPath = processEnv[pathKey],
	} = options;

	let { result } = findBinPath(options);

	const execPathDir = getExePath({
		cwd,
		execPath,
	});

	return {
		pathKey,
		envPath,
		binPaths: result,
		execPath: execPathDir,
		delimiter,
		processEnv,
	};
}
