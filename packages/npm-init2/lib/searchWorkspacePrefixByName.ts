import { parseStaticPackagesPaths } from 'workspaces-config';
import micromatch from 'micromatch';

export function searchWorkspacePrefixByName({
	inputName,
	workspacesConfig,
}: {
	inputName: string,
	cwd?: string,

	targetName?: string,
	hasWorkspace?: string,
	workspacePrefix?: string,
	workspacesConfig: ReturnType<typeof parseStaticPackagesPaths>
})
{
	let workspacePrefix: string = workspacesConfig.prefix[0];

	if (workspacesConfig.prefix.length > 1)
	{
		for (let i in workspacesConfig.prefixSub)
		{
			const prefix = workspacesConfig.prefixSub[i]

			if (prefix.length && micromatch.isMatch(inputName, prefix + '/*'))
			{
				workspacePrefix = workspacesConfig.prefix[i]
				break;
			}

			if (prefix === '')
			{
				workspacePrefix = workspacesConfig.prefix[i]
			}
		}
	}

	return workspacePrefix
}

export default searchWorkspacePrefixByName
