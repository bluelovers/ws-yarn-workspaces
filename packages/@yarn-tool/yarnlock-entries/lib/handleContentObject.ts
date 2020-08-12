import { IYarnLockParsedV1, IYarnLockParsedV2 } from '@yarn-tool/yarnlock-parse/index';
import YarnLockIterator from './YarnLockIterator';

export function handleContentObject<T extends IYarnLockParsedV1 | IYarnLockParsedV2>(data: T)
{
	return new YarnLockIterator<T>(data)
}
