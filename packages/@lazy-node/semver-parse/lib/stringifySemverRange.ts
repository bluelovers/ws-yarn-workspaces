import { ISimpleSemVer } from './types';
import { hasOperator, isSimpleSemVerObjectLike } from './isSimpleSemVerOperatorLike';
import { SimpleSemVer } from './SimpleSemVer';
import { stringifySemver } from './stringifySemver';

export function stringifySemverRange(arr: ISimpleSemVer[])
{
	return arr.reduce((a, ver) =>
	{

		let bool: boolean = true;
		if (hasOperator(ver))
		{
			a.push(ver.operator)

			bool = false;
		}
		if (isSimpleSemVerObjectLike(ver))
		{
			if (ver instanceof SimpleSemVer)
			{
				a.push(ver.toString());
			}
			else
			{
				a.push(stringifySemver(ver));
			}
			bool = false;
		}
		else if (bool === true)
		{
			throw new TypeError(`obj not a ISimpleSemVerLike`)
		}

		return a;
	}, [] as string[]).join(' ')
}
