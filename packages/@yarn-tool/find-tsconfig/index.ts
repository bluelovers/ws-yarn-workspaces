import { findSync } from 'tsconfig';
import { findRoot } from '@yarn-tool/find-root';
import { realpathSync } from 'fs';
import { normalize } from 'path';

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

	let file: string = findSync(cwd) as string;

	if (!file)
	{
		file = findSync(realpathSync(cwd)) as string;
	}

	if (file)
	{
		file = normalize(file);

		if (file.includes(normalize(rooData.pkg)) || rooData.hasWorkspace && !rooData.isWorkspace && file.includes(normalize(rooData.ws)))
		{
			return file;
		}
	}
}

export default findTsconfig
