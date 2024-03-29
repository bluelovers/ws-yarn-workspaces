import { fixDuplicates as _fixDuplicates, listDuplicates as _listDuplicates } from 'yarn-berry-deduplicate';
import { IOptionsDedupe } from '../types';
import { existsYarnLockBanner } from '@yarn-tool/yarnlock-banner';

export function fixDuplicates(yarnlock_old: Buffer | string, options?: IOptionsDedupe): string
{
	yarnlock_old = yarnlock_old.toString();

	const { banner, content } = existsYarnLockBanner(yarnlock_old);

	const output = _fixDuplicates(content, options);
	return `${banner}${output}`
}
