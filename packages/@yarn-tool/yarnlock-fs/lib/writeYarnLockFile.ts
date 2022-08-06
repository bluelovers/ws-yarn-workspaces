import { yarnLockStringify } from '@yarn-tool/yarnlock-stringify';
import { writeFileSync } from 'fs-extra';
import { IYarnLockfileParseObject } from '@yarn-tool/yarnlock/lib/types';

export function writeYarnLockFile(file: string, data: IYarnLockfileParseObject)
{
	return writeFileSync(file, yarnLockStringify(data))
}
