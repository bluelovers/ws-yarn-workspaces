import { validateNpmPackageName } from '@yarn-tool/validate-npm-package-name';
import { join, resolve } from "path";
import { pathExistsSync } from 'fs-extra';
import { parseStaticPackagesPaths, IParseStaticPackagesPathsReturnType } from 'workspaces-config';
import searchWorkspacePrefixByName from '@yarn-tool/search-workspace-prefix-by-name';

export function getTargetDir(options: {
	inputName: string,
	cwd: string,

	targetName?: string,
	hasWorkspace?: string,
	workspacePrefix?: string,
	workspacesConfig?: IParseStaticPackagesPathsReturnType
})
{
	let targetDir: string;
	let targetName: string = options.targetName || null;
	let { inputName, cwd, hasWorkspace, workspacePrefix, workspacesConfig } = options;

	if (hasWorkspace && !workspacesConfig?.prefix?.length)
	{
		throw new RangeError(`can't found workspace prefix`);
	}

	if (targetName)
	{
		validateNpmPackageName(targetName, true);
	}

	let scopedPackagePattern: boolean;

	if (inputName)
	{
		targetName = targetName || inputName;

		let ret = validateNpmPackageName(inputName, true);
		let name = inputName;

		let basePath: string;

		if (hasWorkspace)
		{
			const workspacePrefix = searchWorkspacePrefixByName({
				inputName,
				workspacesConfig,
			})

			basePath = join(hasWorkspace, workspacePrefix);
		}
		else
		{
			basePath = cwd;
		}

		if (ret.scopedPackagePattern)
		{
			name = name
				.replace(/[\/\\]+/g, '_')
				.replace(/^@/g, '')
			;

			if (!pathExistsSync(join(basePath, ret.subname)))
			{
				name = ret.subname;
			}
		}

		scopedPackagePattern = ret.scopedPackagePattern;

		targetDir = resolve(basePath, name);
	}
	else
	{
		targetDir = cwd;
	}

	return {
		targetDir,
		targetName,
		cwd,
		scopedPackagePattern,
	}
}

export default getTargetDir
