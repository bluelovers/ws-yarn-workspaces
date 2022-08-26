import { relative } from "path";
import { pathIsSame } from 'path-is-same';

/**
 * @deprecated
 */
export function isSamePath(p1: string, p2: string)
{
	if (!p1 || !p2)
	{
		return false;
	}
	else if (pathIsSame(p1, p2))
	{
		return true;
	}

	let s = relative(p1, p2);
	return (s === '.' || s === '');
}
