import { realpathSync, lstatSync } from 'fs-extra';

export function sameRealpath(dir0: string, dir1: string)
{
	try
	{
		let real01 = realpathSync(dir0);
		let real02 = realpathSync(dir1);

		return real01 === real02
	}
	catch (e)
	{

	}
}

export function isSymbolicLink(dir0: string)
{
	let stats = lstatSync(dir0);
	return stats.isSymbolicLink()
}
