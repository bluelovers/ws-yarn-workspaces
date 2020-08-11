import SemVer from 'semver/classes/semver';
import { Options } from 'semver';
import semverValidRange from 'semver/ranges/valid';
import { handleVersionRange } from './handleVersionRange';

export function validRange<T extends string | SemVer>(range: T | null | undefined,
	optionsOrLoose?: boolean | Options,
)
{
	return semverValidRange(handleVersionRange(range) as any, optionsOrLoose)
}
