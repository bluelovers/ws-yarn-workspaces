import SemVer from 'semver/classes/semver';
import { Options } from 'semver';
import semverSatisfies from 'semver/functions/satisfies';
import { handleVersionRange } from './handleVersionRange';

export function satisfies(version: string | SemVer, range: string | Range, optionsOrLoose?: boolean | Options)
{
	return semverSatisfies(version, handleVersionRange(range) as any, optionsOrLoose)
}

export default satisfies
