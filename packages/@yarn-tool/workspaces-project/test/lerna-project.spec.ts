import findWorkspaceRoot from 'find-yarn-workspace-root2/core';
import LernaProject from '@lerna/project';
import { checkPaths, EnumCheckPaths } from '../lib/util';

describe(`lerna project`, () =>
{

	let root = findWorkspaceRoot(__dirname);
	const cwd = __dirname;

	test(`check workspace root`, () =>
	{
		let _project = new LernaProject(cwd)
		let rootPath: string = _project.rootPath;

		let actual = checkPaths({
			root,
			rootPath,
		});
		let expected = EnumCheckPaths.rootPath;

		console.dir(actual)

		expect(actual).toStrictEqual(expected);
		//expect(actual).toBeInstanceOf(Date);
		//expect(actual).toMatchSnapshot();

	});

})
