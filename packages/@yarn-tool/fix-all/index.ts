import { findRootLazy } from '@yarn-tool/find-root';
import { npmHostedGitInfoLazy } from '@yarn-tool/pkg-git-info';
import { _fixRoot, _fixWsRoot } from './lib/root/index';
import { _initPkgListableByRootData, _runEachPackages } from './lib/pkg/index';

export interface INpmAutoFixAll
{
	overwriteHostedGitInfo?: boolean;
	branch?: string;
}

export function npmAutoFixAll(cwd: string, options?: INpmAutoFixAll)
{
	cwd ??= process.cwd();

	const rootData = findRootLazy({
		cwd,
	});

	if (!rootData?.root)
	{
		throw new Error(`Invalid workspaces / package: ${cwd}`)
	}

	let { branch, overwriteHostedGitInfo } = options ?? {};

	cwd = rootData.cwd;

	const hostedGitInfo = npmHostedGitInfoLazy(cwd);

	if (rootData.hasWorkspace)
	{
		_fixWsRoot({
			rootData,
			hostedGitInfo,
			branch,
			overwriteHostedGitInfo,
		})
	}
	else
	{
		_fixRoot({
			rootData,
			hostedGitInfo,
			branch,
			overwriteHostedGitInfo,
			targetDir: rootData.root,
		})
	}

	const list = _initPkgListableByRootData(rootData);

	return _runEachPackages(list)
}

export default npmAutoFixAll
