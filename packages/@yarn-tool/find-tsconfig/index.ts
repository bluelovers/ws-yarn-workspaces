import TsconfigLib = require('tsconfig');
import { findRoot } from '@yarn-tool/find-root';
import fs = require('fs');
import path = require('path');

/**
 * find tsconfig and only allow inside current pkg/ws path
 *
 * @param {string} cwd
 * @returns {string}
 */
export function findTsconfig(cwd: string): string
{
	let rooData = findRoot({
		cwd,
	});

	let file: string = TsconfigLib.findSync(cwd) as string;

	if (!file)
	{
		file = TsconfigLib.findSync(fs.realpathSync(cwd)) as string;
	}

	if (file)
	{
		file = path.normalize(file);

		if (file.includes(path.normalize(rooData.pkg)) || rooData.hasWorkspace && !rooData.isWorkspace && file.includes(path.normalize(rooData.ws)))
		{
			return file;
		}
	}
}

export default findTsconfig
