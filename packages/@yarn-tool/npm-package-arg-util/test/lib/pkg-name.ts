/**
 * Created by user on 2026/3/9.
 */
import test, { getTestContext } from 'node:test';
import { parseArgvPkgName, parsePackageName } from '../../lib/parseArgvPkgName';
import { npaTry2 } from '../../index';
import { _assertPropertyMatchers } from './test';

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

	/**
	 * 以 `node:assert` 遞迴比對 propertyMatchers，
	 * 取代 jest 的 `expect(ret).toMatchSnapshot(propertyMatchers)`
	 *
	 * Replace jest's `expect(ret).toMatchSnapshot(propertyMatchers)` with a
	 * recursive `node:assert` comparison
	 */
	if (propertyMatchers)
	{
		_assertPropertyMatchers(ret, propertyMatchers, packageName);
	}

	/**
	 * 以 node:test 的 snapshot 記錄完整結果，
	 * 取代 jest 的 `expect(ret).toMatchSnapshot()`
	 *
	 * Replace jest's `expect(ret).toMatchSnapshot()` with node:test's snapshot
	 */
	(getTestContext() as test.TestContext).assert.snapshot(ret);

	return ret
}

