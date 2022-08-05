import { yarnLockParse } from '@yarn-tool/yarnlock-parse';
import { handleContentObject } from './handleContentObject';
import { IYarnLockParsedV1, IYarnLockParsedV2 } from '@yarn-tool/yarnlock-types';

export function fromContent<T extends IYarnLockParsedV1 | IYarnLockParsedV2>(yarnlock_old: Buffer | string)
{
	return handleContentObject<T>(yarnLockParse(yarnlock_old))
}

export async function fromContentAsync<T extends IYarnLockParsedV1 | IYarnLockParsedV2>(yarnlock_old: Buffer | string)
{
	return fromContent<T>(yarnlock_old)
}

export default fromContent;
