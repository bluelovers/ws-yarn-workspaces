import { fixDuplicates as _fixDuplicates, listDuplicates as _listDuplicates } from 'yarn-deduplicate';
import { IOptionsDedupe } from '../types';
import { existsYarnLockBanner } from '@yarn-tool/yarnlock-banner';

export function fixDuplicates(yarnlock_old: Buffer | string, options?: IOptionsDedupe): string
{
	yarnlock_old = yarnlock_old.toString();

	//let { banner, content } = existsYarnLockBanner(yarnlock_old)

	const output = _fixDuplicates(yarnlock_old, options);
	return `${output}`
}
