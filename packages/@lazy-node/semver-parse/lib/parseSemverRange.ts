import { SimpleSemVer } from './SimpleSemVer';
import { reSemverRange } from './const';
import { ISimpleSemVer } from './types';
import { pruned } from './util/pruned';

export function parseSemverRange(str: string)
{
	let m: RegExpExecArray;
	const arr: SimpleSemVer[] = [];

	while (m = reSemverRange.exec(str))
	{
		let obj: ISimpleSemVer = {
			semver: m[3]
			, operator: m[4] || m[2]
			, major: m[6]
			, minor: m[8]
			, patch: m[10],
		};
		if ('+' === m[12])
		{
			obj.build = m[13];
		}
		if ('-' === m[12])
		{
			obj.release = m[13];
		}
		arr.push(new SimpleSemVer(pruned(obj)));
	}

	return arr;
}

