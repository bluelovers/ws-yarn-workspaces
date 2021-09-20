
import { resolve, delimiter } from "path";
import { Stats, statSync } from "fs";

export function findBinPathCore(options: {
	cwd?: string,
	stopPath?: string | string[]
} = {})
{
	let {
		cwd = process.cwd(),
		stopPath,
	} = options;

	if (typeof stopPath === 'string')
	{
		stopPath = [stopPath];
	}
	else if (!Array.isArray(stopPath))
	{
		stopPath = [];
	}
	else
	{
		stopPath = stopPath.slice();
	}

	let bool: boolean = true;

	let current: string = resolve(cwd);
	let prev: string;
	let result: string[] = [];
	let history: string[] = [];

	stopPath = stopPath.map(v => {
		return resolve(v)
	});

	while (bool)
	{
		if (prev == current)
		{
			break;
		}

		let dir = resolve(current, './node_modules/.bin/');
		history.push(dir);

		let stat: Stats;

		try
		{
			stat = statSync(dir);
			if (stat.isDirectory())
			{
				result.push(dir);
			}
		}
		catch (e)
		{

		}

		if (stopPath.length && stopPath.includes(current))
		{
			break;
		}

		prev = current;
		current = resolve(current, '..');
	}

	return {
		result,
		history,
	}
}

export default findBinPathCore
