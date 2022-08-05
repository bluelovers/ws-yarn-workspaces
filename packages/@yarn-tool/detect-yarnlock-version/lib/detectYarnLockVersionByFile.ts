import { detectYarnLockVersion } from './detectYarnLockVersion';
import { openSync, readSync } from 'fs';
import { join } from 'path';

export function detectYarnLockVersionByFile(file: string)
{
	// @ts-ignore
	const fd = openSync(file)

	const buf = Buffer.alloc(160);

	readSync(fd, buf, 0, 160, 0)

	return detectYarnLockVersion(buf)
}

export function detectYarnLockVersionByDir(dir: string)
{
	return detectYarnLockVersionByFile(join(dir, 'yarn.lock'))
}

export default detectYarnLockVersionByFile
