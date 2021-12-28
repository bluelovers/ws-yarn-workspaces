import { IPackageJson } from '@ts-type/package-dts/package-json';
import { findRootLazy, IFindRootReturnType } from '@yarn-tool/find-root';
import { relative } from 'upath2';
import { INpmHostedGitInfo, npmHostedGitInfo } from '@yarn-tool/pkg-git-info';
import { ITSPickExtra } from 'ts-type/lib/type/record';

export interface IFillPkgHostedInfoOptions
{
	targetDir?: string;
	rootData?: IFindRootReturnType;
	branch?: string;
	hostedGitInfo?: INpmHostedGitInfo;
}

export type IFillPkgHostedInfoFields = {
	homepage: string,
	bugs: {
		url: string,
	},
	repository: {
		type: string | 'git',
		url: string
	}
}

export function _hostedGitInfoToFields<P extends Partial<IPackageJson>>(pkg: P, options: ITSPickExtra<IFillPkgHostedInfoOptions, 'hostedGitInfo' | 'rootData' | 'targetDir'>,
): P & IFillPkgHostedInfoFields
{
	let { targetDir, rootData, branch, hostedGitInfo } = options;

// @ts-ignore
	pkg.homepage ||= hostedGitInfo.homepage;

	// @ts-ignore
	pkg.bugs ||= {
		url: hostedGitInfo.bugs,
	};

	// @ts-ignore
	pkg.repository ||= {
		"type": "git",
		url: hostedGitInfo.repository,
	};

	if (rootData?.hasWorkspace)
	{
		branch ??= 'master';

		let u = new URL(pkg.homepage as string);

		u.pathname += `/tree/${branch}/` + relative(rootData.ws, targetDir);

		// @ts-ignore
		pkg.homepage = u.toString();
	}

	return pkg as any
}

export function fillPkgHostedInfo<P extends IPackageJson>(pkg: P,
	options?: IFillPkgHostedInfoOptions,
): P & IFillPkgHostedInfoFields
{
	if (!pkg.homepage || !pkg.bugs || !pkg.repository)
	{
		let { targetDir, rootData, branch, hostedGitInfo } = options ?? {};

		rootData ??= findRootLazy({
			cwd: targetDir,
		});

		targetDir ??= rootData.pkg;

		try
		{
			hostedGitInfo ??= npmHostedGitInfo(targetDir);

			_hostedGitInfoToFields(pkg, {
				hostedGitInfo,
				rootData,
				branch,
				targetDir,
			});
		}
		catch (e)
		{

		}
	}

	return pkg as any
}

export default fillPkgHostedInfo
