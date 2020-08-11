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
