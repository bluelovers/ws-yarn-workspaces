import { IYarnLockParsedV1, IYarnLockParsedV2, yarnLockParse } from '@yarn-tool/yarnlock-parse/index';
import { handleContentObject } from './handleContentObject';

export function fromContent<T extends IYarnLockParsedV1 | IYarnLockParsedV2>(yarnlock_old: Buffer | string)
{
	return handleContentObject<T>(yarnLockParse(yarnlock_old))
}

export async function fromContentAsync<T extends IYarnLockParsedV1 | IYarnLockParsedV2>(yarnlock_old: Buffer | string)
{
	return fromContent<T>(yarnlock_old)
}

export default fromContent;
