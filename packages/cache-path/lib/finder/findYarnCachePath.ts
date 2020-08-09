import { join, normalize } from "upath2";
import { pathExistsSync } from 'fs-extra';
import { sync as crossSpawnExtra } from 'cross-spawn-extra';

export function findYarnCachePath(cwd?: string, processEnv = process.env): string
{
	try
	{
		let cp = crossSpawnExtra('yarn', [
			'config',
			'current',
			'--json',
		], {
			stripAnsi: true,
			env: processEnv,
			cwd,
		});

		let data = JSON.parse(JSON.parse(cp.stdout.toString()).data);

		if (data.tempFolder)
		{
			return normalize(data.tempFolder)
		}
	}
	catch (e)
	{

	}

	if (processEnv.YARN_CACHE_FOLDER && pathExistsSync(processEnv.YARN_CACHE_FOLDER))
	{
		return normalize(processEnv.YARN_CACHE_FOLDER)
	}
}
