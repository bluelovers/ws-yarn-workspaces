import { reHandleVersionRange } from './const';

export function handleVersionRange<T>(versionRange: T): T
{
	if (typeof versionRange === 'string')
	{
		return versionRange.replace(reHandleVersionRange, ' ').trim() as any
	}

	return versionRange
}
