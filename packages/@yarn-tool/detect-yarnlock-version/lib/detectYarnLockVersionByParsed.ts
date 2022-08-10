import { IYarnLockParsed, IYarnLockParsedLoose } from '@yarn-tool/yarnlock-types';

export function detectYarnLockVersionByParsed(parsedObject: IYarnLockParsed | IYarnLockParsedLoose)
{
	if (parsedObject.verType && 'meta' in parsedObject && 'data' in parsedObject)
	{
		return parsedObject.verType
	}
}
