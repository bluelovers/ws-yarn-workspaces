import { IFsYarnLockReturnType } from './types';
import { join } from "path";
import { checkAndReadYarnLockFileSafe } from './readYarnLockFile';
import { notEmpty as checkYarnLockFileUnsafeCore } from './notEmpty';
import { pathExistsSync, readFileSync } from 'fs-extra';

/**
 * @deprecated
 */
export function fsYarnLock(root: string): IFsYarnLockReturnType
{
	let yarnlock_file = join(root, 'yarn.lock');

	let yarnlock_exists = pathExistsSync(yarnlock_file);

	let yarnlock_old = yarnlock_exists && readFileSync(yarnlock_file, 'utf8') || null;

	return {
		yarnlock_file,
		yarnlock_exists,
		yarnlock_old,
	}
}

export function fsYarnLockSafe(root: string): IFsYarnLockReturnType
{
	const yarnlock_file = join(root, 'yarn.lock');

	const yarnlock_old = checkAndReadYarnLockFileSafe<string>(yarnlock_file, 'utf8');

	const yarnlock_exists = checkYarnLockFileUnsafeCore(yarnlock_old);

	return {
		yarnlock_file,
		yarnlock_exists,
		yarnlock_old,
	}
}

export default fsYarnLockSafe;
