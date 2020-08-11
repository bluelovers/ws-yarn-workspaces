import SemVer from 'semver/classes/semver';
import { Options } from 'semver';
import semverSimplifyRange from 'semver/ranges/simplify';
import { handleVersionRange } from './handleVersionRange';

export function simplifyRange<T extends string | SemVer>(ranges: string[], range: T, options?: Options,
)
{
	return semverSimplifyRange(ranges, handleVersionRange(range) as any, options) as T
}

export default simplifyRange
