import { SimpleSemVer } from './SimpleSemVer';
import { reSemverRange, EnumVersionExtra } from './const';
import { ISimpleSemVer, IOperator } from './types';
import { pruned } from './util/pruned';

export function parseSemverRange(str: string)
{
	let m: RegExpExecArray;
	const arr: SimpleSemVer[] = [];

	while (m = reSemverRange.exec(str))
	{
		let obj: ISimpleSemVer = {
			semver: m[3]
			, operator: (m[4] || m[2]) as IOperator
			, major: m[6]
			, minor: m[8]
			, patch: m[10],
		};
		if (EnumVersionExtra.build === m[12])
		{
			obj.build = m[13];
		}
		if (EnumVersionExtra.release === m[12])
		{
			obj.release = m[13];
		}

		arr.push(new SimpleSemVer(obj));
	}

	return arr;
}

export default parseSemverRange
