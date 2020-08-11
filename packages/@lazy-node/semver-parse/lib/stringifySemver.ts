import { ISimpleSemVerObject } from './types';

export function stringifySemver(obj: ISimpleSemVerObject)
{
	let str = '';

	str += obj.major ?? '0';
	str += '.';
	str += obj.minor ?? '0';
	str += '.';
	str += obj.patch ?? '0';

	if (obj.release?.length > 0)
	{
		str += '-' + obj.release;
	}

	if (obj.build?.length > 0)
	{
		str += '+' + obj.build;
	}

	return str;
}


