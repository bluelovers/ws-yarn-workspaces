import SemVer from 'semver/classes/semver';
import { Options } from 'semver';
import semverMinSatisfying from 'semver/ranges/min-satisfying';
import { handleAmpersandAndSpaces } from './handleAmpersandAndSpaces';

export function minSatisfying<T extends string | SemVer>(versions: ReadonlyArray<T>,
	range: string | Range,
	optionsOrLoose?: boolean | Options,
): T
{
	return semverMinSatisfying(versions, handleAmpersandAndSpaces(range) as any, optionsOrLoose)
}

export default minSatisfying
