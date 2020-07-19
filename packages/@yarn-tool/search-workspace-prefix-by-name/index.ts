import micromatch from 'micromatch';
import { IParseStaticPackagesPathsReturnType } from 'workspaces-config';

export function searchWorkspacePrefixByName({
	inputName,
	workspacesConfig,
}: {
	inputName: string,
	cwd?: string,

	targetName?: string,
	hasWorkspace?: string,
	workspacePrefix?: string,
	workspacesConfig: IParseStaticPackagesPathsReturnType
})
{
	let workspacePrefix: string;

	if (workspacesConfig.prefix.includes("packages/*"))
	{
		workspacePrefix = "packages/*";
	}
	else
	{
		workspacePrefix = workspacesConfig.prefix[0]
	}

	if (workspacesConfig.prefix.length > 1)
	{
		for (let i = 0; i < workspacesConfig.prefixSub.length; i++)
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

export default searchWorkspacePrefixByName;
