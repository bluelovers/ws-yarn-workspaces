import { reAmpersandAndSpaces, reSpaces } from './const';
import { IOptions } from './types';

export function handleAmpersandAndSpaces<T>(versionRange: T, options?: IOptions): T
{
	if (typeof versionRange === 'string')
	{
		return versionRange.replace(options?.noAmpersand ? reSpaces : reAmpersandAndSpaces, ' ').trim() as any
	}

	return versionRange
}

export default handleAmpersandAndSpaces
