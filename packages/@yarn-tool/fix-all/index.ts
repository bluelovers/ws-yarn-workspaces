import { findRoot, findRootLazy } from '@yarn-tool/find-root';
import { npmHostedGitInfoLazy } from '@yarn-tool/pkg-git-info';
import { _fixRoot, _fixWsRoot } from './lib/root/index';
import { _initPkgListableByRootData, _runEachPackagesAsync } from './lib/pkg/index';
import { consoleLogger } from 'debug-color2/logger';
import Bluebird from 'bluebird';

export interface INpmAutoFixAll
{
	overwriteHostedGitInfo?: boolean;
	branch?: string;
}

export function npmAutoFixAll(cwd: string, options?: INpmAutoFixAll)
{
	return Bluebird.resolve().then(() =>
	{
		cwd ??= process.cwd();

		consoleLogger.info(`cwd: ${cwd}`);

		let rootData = findRootLazy({
			cwd,
		});

		if (!rootData?.root)
		{
			throw new Error(`Invalid workspaces / package: ${cwd}`)
		}

		if (rootData.hasWorkspace && !rootData.isWorkspace)
		{
			rootData = findRoot({
				cwd: rootData.root,
			});
		}

		console.log(`root:`, rootData.root);
		console.log(`hasWorkspace:`, rootData.hasWorkspace);

		let { branch, overwriteHostedGitInfo } = options ?? {};

		cwd = rootData.cwd;

		consoleLogger.info(`check git info`);

		const hostedGitInfo = npmHostedGitInfoLazy(cwd);

		console.log(`homepage:`, hostedGitInfo.homepage);
		console.log(`repository:`, hostedGitInfo.repository);

		consoleLogger.info(`auto fix root of workspaces / package`);

		console.log(`root:`, rootData.root);

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

		return _runEachPackagesAsync(list, {
			rootData,
			overwriteHostedGitInfo,
			branch,
			hostedGitInfo,
		})
	}).then(() => void 0 as void)
}

export default npmAutoFixAll
