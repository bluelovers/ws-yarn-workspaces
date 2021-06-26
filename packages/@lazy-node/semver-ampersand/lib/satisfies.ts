import SemVer from 'semver/classes/semver';
import { Options } from 'semver';
import semverSatisfies from 'semver/functions/satisfies';
import { handleAmpersandAndSpaces } from './handleAmpersandAndSpaces';

export function satisfies(version: string | SemVer, range: string | Range, optionsOrLoose?: boolean | Options)
{
	return semverSatisfies(version, handleAmpersandAndSpaces(range) as any, optionsOrLoose)
}

export default satisfies
