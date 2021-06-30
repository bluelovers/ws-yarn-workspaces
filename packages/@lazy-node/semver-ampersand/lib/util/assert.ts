import { IOptionsOrLoose } from '../types';
import parseOptionsOrLoose from 'semver/internal/parse-options';
import { reInvalidCharacter, reInvalidCharacterOrAmpersand } from '../const';

export function hasInvalidCharacter(semver: string,
	optionsOrLoose?: IOptionsOrLoose,
)
{
	return (parseOptionsOrLoose(optionsOrLoose).noAmpersand
		? reInvalidCharacter
		: reInvalidCharacterOrAmpersand).test(semver)
}

export function assertInvalidCharacter(semver: string,
	optionsOrLoose?: IOptionsOrLoose,
): asserts semver is string
{
	const m = semver.match(parseOptionsOrLoose(optionsOrLoose).noAmpersand
		? reInvalidCharacter
		: reInvalidCharacterOrAmpersand);

	if (m?.length)
	{
		throw new TypeError(`Invalid SemVer Character: '${m[0]}' at index ${m.index} of '${semver}'`)
	}
}
