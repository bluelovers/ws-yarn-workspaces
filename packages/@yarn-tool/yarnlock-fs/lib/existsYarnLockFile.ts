import { pathExistsSync } from 'fs-extra';

export function existsYarnLockFile(file: string)
{
	return pathExistsSync(file)
}
