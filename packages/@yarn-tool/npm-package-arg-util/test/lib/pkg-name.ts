/**
 * Created by user on 2026/3/9.
 */
import { parseArgvPkgName, parsePackageName } from '../../lib/parseArgvPkgName';
import { npaTry2 } from '../../index';

interface I_lazyParsePackageName
{
	parsePackageName: ReturnType<typeof parsePackageName>;
	parseArgvPkgName: ReturnType<typeof parseArgvPkgName>;
	npaTry2: ReturnType<typeof npaTry2>;
}

export function _lazyParsePackageName(packageName: string, propertyMatchers?: Partial<I_lazyParsePackageName>)
{
	let r1 = parsePackageName(packageName);
	let r2 = parseArgvPkgName(packageName);

	let ret: I_lazyParsePackageName = {
		parsePackageName: r1,
		parseArgvPkgName: r2,
		npaTry2: npaTry2(packageName),
	};

	if (propertyMatchers)
	{
		expect(ret).toMatchSnapshot(propertyMatchers);
	}
	else
	{
		expect(ret).toMatchSnapshot();
	}

	return ret
}

