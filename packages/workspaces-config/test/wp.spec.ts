/**
 * Created by user on 2020/4/6.
 */
import { parseWorkspaces, parseStaticPackagesPaths } from '../index';

const data = [
	"packages/@yarn-tool/*",
	"packages/*",
]

it('should parseWorkspaces', function ()
{
	let actual = parseWorkspaces(data)

	expect(actual).toStrictEqual({
		packages: [
			"packages/@yarn-tool/*",
			"packages/*",
		],
	})
	expect(actual).toMatchSnapshot();
});

it('should parseWorkspaces v2', function ()
{
	let actual = parseWorkspaces({ packages: data })

	expect(actual).toStrictEqual({
		packages: [
			"packages/@yarn-tool/*",
			"packages/*",
		],
	})
	expect(actual).toMatchSnapshot();
});

it('should parseStaticPackagesPaths', function ()
{
	let actual = parseStaticPackagesPaths(data)

	expect(actual).toStrictEqual({
		static: [],
		prefixRoot: ['packages', 'packages'],
		prefix: ['packages/@yarn-tool', 'packages'],
		prefixSub: ['@yarn-tool', ''],
		all: ['packages/@yarn-tool/*', 'packages/*'],
	})
	expect(actual).toMatchSnapshot();
});
