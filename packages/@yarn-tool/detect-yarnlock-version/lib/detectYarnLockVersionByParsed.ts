import { IYarnLockParsed } from '@yarn-tool/yarnlock-types';

export function detectYarnLockVersionByParsed(parsedObject: IYarnLockParsed)
{
	if (parsedObject.verType && 'meta' in parsedObject && 'data' in parsedObject)
	{
		return parsedObject.verType
	}
}
