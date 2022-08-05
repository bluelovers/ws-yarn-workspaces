import { YarnLockIterator } from './YarnLockIterator';
import { IYarnLockParsedV1, IYarnLockParsedV2 } from '@yarn-tool/yarnlock-types';

export function handleContentObject<T extends IYarnLockParsedV1 | IYarnLockParsedV2>(data: T)
{
	return new YarnLockIterator<T>(data)
}

export async function handleContentObjectAsync<T extends IYarnLockParsedV1 | IYarnLockParsedV2>(data: T)
{
	return handleContentObject(data)
}
