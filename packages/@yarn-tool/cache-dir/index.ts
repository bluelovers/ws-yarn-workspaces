import { join, normalize } from "upath2";
import { pathExistsSync } from 'fs-extra';
import { sync as crossSpawnExtra } from 'cross-spawn-extra';

export function getYarnCacheDir(): string
{
	try
	{
		let cp = crossSpawnExtra('yarn', [
			'config',
			'current',
			'--json',
		], {
			stripAnsi: true,
			env: process.env,
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

	if (process.env.YARN_CACHE_FOLDER && pathExistsSync(process.env.YARN_CACHE_FOLDER))
	{
		return normalize(process.env.YARN_CACHE_FOLDER)
	}
}

export default getYarnCacheDir
