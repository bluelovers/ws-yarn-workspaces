import { ISimpleSemVer, ISimpleSemVerObject } from './types';
import { parseSimpleSemVer } from './parseSimpleSemVer';
import { assertSimpleSemVerObjectOrOperatorLike } from './checker';

export function replaceSimpleSemVerVersion(oldSemVer: string | ISimpleSemVer, new_version: string)
{
	if (typeof oldSemVer === 'string')
	{
		oldSemVer = parseSimpleSemVer(oldSemVer);
	}

	assertSimpleSemVerObjectOrOperatorLike(oldSemVer);

	const operator = oldSemVer.operator;

	const obj = parseSimpleSemVer(new_version);

	// @ts-ignore
	obj.operator = operator;

	return obj
}
