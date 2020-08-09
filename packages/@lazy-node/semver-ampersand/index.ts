import semverSatisfies from 'semver/functions/satisfies';
import semverMaxSatisfying from 'semver/ranges/max-satisfying';
import semverMinSatisfying from 'semver/ranges/min-satisfying';
import SemVer from 'semver/classes/semver';
import { Options } from 'semver';
import semverValidRange from 'semver/ranges/valid';
import semverSimplifyRange from 'semver/ranges/simplify';

export const reHandleVersionRange = /[&\s]+/g;

export function handleVersionRange<T>(versionRange: T): T
{
	if (typeof versionRange === 'string')
	{
		return versionRange.replace(reHandleVersionRange, ' ').trim() as any
	}

	return versionRange
}

export function satisfies(version: string | SemVer, range: string | Range, optionsOrLoose?: boolean | Options)
{
	return semverSatisfies(version, handleVersionRange(range) as any, optionsOrLoose)
}

export function maxSatisfying<T extends string | SemVer>(versions: ReadonlyArray<T>,
	range: string | Range,
	optionsOrLoose?: boolean | Options,
): T
{
	return semverMaxSatisfying(versions, handleVersionRange(range) as any, optionsOrLoose)
}

export function minSatisfying<T extends string | SemVer>(versions: ReadonlyArray<T>,
	range: string | Range,
	optionsOrLoose?: boolean | Options,
): T
{
	return semverMinSatisfying(versions, handleVersionRange(range) as any, optionsOrLoose)
}

export function validRange<T extends string | SemVer>(range: T | null | undefined,
	optionsOrLoose?: boolean | Options,
)
{
	return semverValidRange(handleVersionRange(range) as any, optionsOrLoose)
}

export function simplifyRange<T extends string | SemVer>(ranges: string[], range: T, options?: Options,
)
{
	return semverSimplifyRange(ranges, handleVersionRange(range) as any, options) as T
}

export default {
	satisfies,

	maxSatisfying,
	minSatisfying,

	validRange,
	simplifyRange,

	handleVersionRange,
}
