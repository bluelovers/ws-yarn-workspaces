import { parseWorkspaces, parseStaticPackagesPaths } from 'workspaces-config';
import { searchWorkspacePrefixByName } from '..';

const data = [
	"packages/@yarn-tool/*",
	"packages/*",
]

const workspacesConfig = parseStaticPackagesPaths(data)

it('should searchWorkspacePrefixByName', function ()
{

	let actual = searchWorkspacePrefixByName({
		inputName: '@yarn-tool/kkk',
		workspacesConfig,
	})

	expect(actual).toStrictEqual('packages/@yarn-tool')
	expect(actual).toMatchSnapshot();

	actual = searchWorkspacePrefixByName({
		inputName: 'kkk',
		workspacesConfig,
	})

	expect(actual).toStrictEqual('packages')
	expect(actual).toMatchSnapshot();

});
