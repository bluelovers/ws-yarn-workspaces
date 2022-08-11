import { buildDiff } from './lib/diff-service';
import { buildDiffTable } from './lib/formatter';
import { IOptionsParseVersionsDiff } from '@yarn-tool/semver-diff';
import { ITSValueOrArray } from 'ts-type/lib/type/base';
import { _buildDiffTableCore, _handleDiffTable } from './lib/formatter/buildDiffTable002';

export { buildDiff }
export { buildDiffTable }

export function yarnLockDiff(yarnlock_old: ITSValueOrArray<Buffer | string>,
	yarnlock_new: ITSValueOrArray<Buffer | string>,
	options?: IOptionsParseVersionsDiff
): string
{
	return _handleDiffTable(_yarnLockDiffCore(yarnlock_old, yarnlock_new, options), options)
}

export function _yarnLockDiffCore(yarnlock_old: ITSValueOrArray<Buffer | string>, yarnlock_new: ITSValueOrArray<Buffer | string>, options: IOptionsParseVersionsDiff)
{
	const diff = buildDiff(yarnlock_old, yarnlock_new)

	return _buildDiffTableCore(diff, options)
}

export default yarnLockDiff
