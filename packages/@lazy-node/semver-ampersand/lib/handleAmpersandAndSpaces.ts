import { reAmpersandAndSpaces } from './const';

export function handleAmpersandAndSpaces<T>(versionRange: T): T
{
	if (typeof versionRange === 'string')
	{
		return versionRange.replace(reAmpersandAndSpaces, ' ').trim() as any
	}

	return versionRange
}

export default handleAmpersandAndSpaces
