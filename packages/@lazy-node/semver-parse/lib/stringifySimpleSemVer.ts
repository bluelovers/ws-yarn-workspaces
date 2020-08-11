import { ISimpleSemVerObject } from './types';
import { EnumVersionExtra } from './const';
import SimpleSemVer from './SimpleSemVer';
import { assertSimpleSemVerOperatorLike, assertSimpleSemVerObjectLike } from './checker';

export function stringifySimpleSemVer(obj: ISimpleSemVerObject | SimpleSemVer)
{
	assertSimpleSemVerObjectLike(obj);

	let str = '';

	str += obj.major ?? '0';
	str += '.';
	str += obj.minor ?? '0';
	str += '.';
	str += obj.patch ?? '0';

	if (obj.release?.length > 0)
	{
		str += EnumVersionExtra.release + obj.release;
	}

	if (obj.build?.length > 0)
	{
		str += EnumVersionExtra.build + obj.build;
	}

	return str;
}

export function stringifySemverFull(obj: ISimpleSemVerObject | SimpleSemVer)
{
	return (obj.operator ?? '') + stringifySimpleSemVer(obj)
}

export default stringifySimpleSemVer

