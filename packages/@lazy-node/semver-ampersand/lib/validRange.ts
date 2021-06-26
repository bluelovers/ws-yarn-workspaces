import SemVer from 'semver/classes/semver';
import { Options } from 'semver';
import semverValidRange from 'semver/ranges/valid';
import { handleAmpersandAndSpaces } from './handleAmpersandAndSpaces';

export function validRange<T extends string | SemVer>(range: T | null | undefined,
	optionsOrLoose?: boolean | Options,
)
{
	return semverValidRange(handleAmpersandAndSpaces(range) as any, optionsOrLoose)
}

export default validRange
