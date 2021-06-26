import SemVer from 'semver/classes/semver';
import { Options } from 'semver';
import semverMaxSatisfying from 'semver/ranges/max-satisfying';
import { handleAmpersandAndSpaces } from './handleAmpersandAndSpaces';

export function maxSatisfying<T extends string | SemVer>(versions: ReadonlyArray<T>,
	range: string | Range,
	optionsOrLoose?: boolean | Options,
): T
{
	return semverMaxSatisfying(versions, handleAmpersandAndSpaces(range) as any, optionsOrLoose)
}

export default maxSatisfying
