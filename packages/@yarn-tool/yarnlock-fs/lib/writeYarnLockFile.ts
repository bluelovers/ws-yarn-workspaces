import { stringify } from '@yarn-tool/yarnlock/lib/parse';
import { writeFileSync } from 'fs-extra';
import { IYarnLockfileParseObject } from '@yarn-tool/yarnlock/lib/types';

export function writeYarnLockFile(file: string, data: IYarnLockfileParseObject)
{
	return writeFileSync(file, stringify(data))
}
