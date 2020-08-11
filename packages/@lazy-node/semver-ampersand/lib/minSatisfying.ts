import SemVer from 'semver/classes/semver';
import { Options } from 'semver';
import semverMinSatisfying from 'semver/ranges/min-satisfying';
import { handleVersionRange } from './handleVersionRange';

export function minSatisfying<T extends string | SemVer>(versions: ReadonlyArray<T>,
	range: string | Range,
	optionsOrLoose?: boolean | Options,
): T
{
	return semverMinSatisfying(versions, handleVersionRange(range) as any, optionsOrLoose)
}
