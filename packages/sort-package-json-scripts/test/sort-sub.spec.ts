import { array_unique } from 'array-hyper-unique';
import { defaultNpmScriptsOrder, omitKey } from '../lib/util';
import sortPackageJsonScripts from '../index';

test(`sort sub level`, () =>
{
	let keys = array_unique([
		...defaultNpmScriptsOrder.values(),

		"start",
		"dev",
		"restart",
		"stop",
		"coverage",
		"lint",
		"test",
		"install",
		"uninstall",
		"build",
		"link",
		"npm",
		"prepublish",
		"prepare",
		"prepublishOnly",
		"prepack",
		"pack",
		"postpack",
		"publish",
		"postpublish",
		"shrinkwrap",
		"version",

		"myscript",
		"_myscript",
		"_myscript_",
		"myscript_",
		"myscript:abc",
	]);

	let source = keys.slice()
		.reduce((a, k, i) =>
		{

			let { name, omitted, key } = omitKey(k);

			addPrefix(a, name, i);
			addPrefix(a, omitted, i);
			addPrefix(a, key, i);
			addPrefix(a, k, i);

			[...defaultNpmScriptsOrder.values()]
				.forEach((kk) =>
				{

					addPrefix(a, name+':'+kk, i);
					addPrefix(a, omitted+':'+kk, i);
					addPrefix(a, key+':'+kk, i);
					addPrefix(a, k+':'+kk, i);

				})
			;

			return a
		}, {} as Record<string, string>);

	let actual = sortPackageJsonScripts(source)

	expectMatchSnapshot(actual, source)

	function addPrefix(scripts: Record<string, string>, key: string, index: number)
	{
		scripts[`pre${key}`] = `echo pre${key}`;
		scripts[`${key}`] = `echo ${key}`;
		scripts[`post${key}`] = `echo post${key}`;
	}

});

function expectStringify(actual, expected)
{
	expect(actual).toStrictEqual(expected);
	expect(JSON.stringify(actual, null, 2)).toStrictEqual(JSON.stringify(expected, null, 2));
}

function expectMatchSnapshot(actual, fixture)
{
	expect(actual).toStrictEqual(fixture);

	//expect(actual).toMatchSnapshot();
	expect(Object.keys(actual)).toMatchSnapshot();
	expect(JSON.stringify(actual, null, 2)).toMatchSnapshot();

	console.dir(actual)
}
