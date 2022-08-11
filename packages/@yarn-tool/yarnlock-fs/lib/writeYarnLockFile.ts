import { yarnLockStringify } from '@yarn-tool/yarnlock-stringify';
import { writeFileSync } from 'fs-extra';
import { IYarnLockSource } from '@yarn-tool/yarnlock-types';

export function writeYarnLockFile(file: string, data: IYarnLockSource)
{
	return writeFileSync(file, yarnLockStringify(data))
}
