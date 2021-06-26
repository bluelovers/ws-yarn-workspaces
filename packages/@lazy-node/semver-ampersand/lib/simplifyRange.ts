import SemVer from 'semver/classes/semver';
import { Options } from 'semver';
import semverSimplifyRange from 'semver/ranges/simplify';
import { handleAmpersandAndSpaces } from './handleAmpersandAndSpaces';

export function simplifyRange<T extends string | SemVer>(ranges: string[], range: T, options?: Options,
)
{
	return semverSimplifyRange(ranges, handleAmpersandAndSpaces(range) as any, options) as T
}

export default simplifyRange
