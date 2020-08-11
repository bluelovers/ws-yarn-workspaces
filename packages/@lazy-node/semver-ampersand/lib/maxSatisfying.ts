import SemVer from 'semver/classes/semver';
import { Options } from 'semver';
import semverMaxSatisfying from 'semver/ranges/max-satisfying';
import { handleVersionRange } from './handleVersionRange';

export function maxSatisfying<T extends string | SemVer>(versions: ReadonlyArray<T>,
	range: string | Range,
	optionsOrLoose?: boolean | Options,
): T
{
	return semverMaxSatisfying(versions, handleVersionRange(range) as any, optionsOrLoose)
}
