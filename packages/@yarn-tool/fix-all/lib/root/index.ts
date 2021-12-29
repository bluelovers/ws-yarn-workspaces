import { ITSRequiredPick } from 'ts-type/lib/type/record';
import { fillPkgHostedInfo, IFillPkgHostedInfoOptions } from '@yarn-tool/pkg-hosted-info';
import { join } from 'upath2';
import { npmHostedGitInfoLazy } from '@yarn-tool/pkg-git-info';
import { PackageJsonLoader } from 'npm-package-json-loader';
import { WorkspacesScope } from '@yarn-tool/ws-scope';
import { sortPackageJson } from 'sort-package-json3';

export function _fixRoot(options: Required<IFillPkgHostedInfoOptions>)
{
	let { rootData, branch, overwriteHostedGitInfo, hostedGitInfo, targetDir } = options;

	const root_file_package_json = join(targetDir, 'package.json');

	let root_pkg_json = new PackageJsonLoader(root_file_package_json);

	hostedGitInfo ??= npmHostedGitInfoLazy();

	if (hostedGitInfo)
	{
		fillPkgHostedInfo(root_pkg_json.data, {
			targetDir,
			rootData,
			hostedGitInfo,
			branch,
			overwriteHostedGitInfo,
		});

		root_pkg_json.data = sortPackageJson(root_pkg_json.data);

		root_pkg_json.write();
	}

	return {
		root_file_package_json,
		root_pkg_json,
		targetDir,
		rootData,
		hostedGitInfo,
		branch,
		overwriteHostedGitInfo,
	}
}

export function _fixWsRoot(options: ITSRequiredPick<IFillPkgHostedInfoOptions, 'hostedGitInfo' | 'rootData' | 'overwriteHostedGitInfo' | 'branch'>)
{
	if (!options.rootData.ws?.length)
	{
		throw new Error(`Invalid workspaces`)
	}

	let runtime = _fixRoot({
		...options,
		targetDir: options.rootData.ws,
	});

	let wss = new WorkspacesScope(runtime.rootData.ws);
	wss.syncValue();
	wss.save();

	return runtime
}
