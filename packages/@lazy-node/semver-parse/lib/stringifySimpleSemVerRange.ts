import { ISimpleSemVer } from './types';
import { hasOperator, isSimpleSemVerObjectLike, isSimpleSemVerOperatorLike } from './checker';
import { SimpleSemVer } from './SimpleSemVer';
import { stringifySimpleSemVer, stringifySemverFull } from './stringifySimpleSemVer';

export function stringifySimpleSemVerRange(arr: ISimpleSemVer[])
{
	return arr.reduce((a, ver) =>
	{
		if (isSimpleSemVerOperatorLike(ver))
		{
			a.push(ver.operator)
		}
		else if (isSimpleSemVerObjectLike(ver))
		{
			let str: string;

			if (ver instanceof SimpleSemVer)
			{
				str = ver.toFullString()
			}
			else
			{
				str = stringifySemverFull(ver);
			}

			a.push(str)
		}
		else
		{
			throw new TypeError(`obj not a ISimpleSemVerLike`)
		}

		return a;
	}, [] as string[]).join(' ')
}

export default stringifySimpleSemVerRange
