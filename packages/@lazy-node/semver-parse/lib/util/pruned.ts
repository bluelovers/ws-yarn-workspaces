import { ISimpleSemVerObjectBase, ISimpleSemVer } from '../types';
import { simpleSemVerKeys } from '../const';

/**
 * Returns a new object with all of the undefined properties removed from the given object
 */
export function pruned<T>(obj: T, o = {} as T)
{
	for (const key in obj)
	{
		if ('undefined' !== typeof obj[key])
		{
			o[key] = obj[key];
		}
	}
	return o;
}

export function prunedSimpleSemVer<T extends ISimpleSemVer>(obj: T, o = {} as T)
{
	for (const key of simpleSemVerKeys)
	{
		if ('undefined' !== typeof obj[key])
		{
			// @ts-ignore
			o[key] = obj[key];
		}
	}

	return o;
}

export default prunedSimpleSemVer
