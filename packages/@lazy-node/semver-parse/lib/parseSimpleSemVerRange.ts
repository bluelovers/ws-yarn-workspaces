import { SimpleSemVer } from './SimpleSemVer';
import { reSemverRange, EnumVersionExtra } from './const';
import { ISimpleSemVer, IOperator, IToSimpleSemVerObjectOrOperator, ISimpleSemVerObjectBase } from './types';
import { pruned } from './util/pruned';

export function parseSimpleSemVerRange(str: string)
{
	let m: RegExpExecArray;
	const arr: (IToSimpleSemVerObjectOrOperator<SimpleSemVer>)[] = [];

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

		arr.push(new SimpleSemVer(obj) as any);
	}

	return arr;
}

export default parseSimpleSemVerRange
