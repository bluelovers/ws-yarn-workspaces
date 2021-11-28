import { buildDiff } from './lib/diff-service';
import { buildDiffTable } from './lib/formatter';
import { IOptionsParseVersionsDiff } from '@yarn-tool/semver-diff';
import { ITSValueOrArray } from 'ts-type/lib/type/base';

export { buildDiff }
export { buildDiffTable }

export function yarnLockDiff(yarnlock_old: ITSValueOrArray<Buffer | string>, yarnlock_new: ITSValueOrArray<Buffer | string>, options?: IOptionsParseVersionsDiff): string
{
	const diff = buildDiff(yarnlock_old, yarnlock_new)

	return buildDiffTable(diff, options)
}

export default yarnLockDiff
