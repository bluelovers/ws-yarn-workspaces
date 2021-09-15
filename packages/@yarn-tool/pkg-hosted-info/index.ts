import { IPackageJson } from '@ts-type/package-dts/package-json';
import { findRoot, findRootLazy, IFindRootReturnType } from '@yarn-tool/find-root';
import { relative } from 'upath2';
import { npmHostedGitInfo } from '@yarn-tool/pkg-git-info';

export function fillPkgHostedInfo<P extends Partial<IPackageJson>>(pkg: P, options?: {
	targetDir?: string,
	rootData?: IFindRootReturnType,
	branch?: string,
}): P & {
	homepage: string,
	bugs: {
		url: string,
	},
	repository: {
		type: string | 'git',
		url: string
	}
}
{
	if (!pkg.homepage || !pkg.bugs || !pkg.repository)
	{
		let { targetDir, rootData, branch } = options ?? {};

		rootData ??= findRootLazy({
			cwd: targetDir,
		});

		targetDir ??= rootData.pkg;

		try
		{
			let info = npmHostedGitInfo(targetDir);

			// @ts-ignore
			pkg.homepage ||= info.homepage;

			// @ts-ignore
			pkg.bugs ||= {
				url: info.bugs,
			};

			// @ts-ignore
			pkg.repository ||= {
				"type": "git",
				url: info.repository,
			};

			if (rootData?.hasWorkspace)
			{
				branch ??= 'master';

				let u = new URL(pkg.homepage as string);

				u.pathname += `/tree/${branch}/` + relative(rootData.ws, targetDir);

				// @ts-ignore
				pkg.homepage = u.toString();
			}
		}
		catch (e)
		{

		}
	}

	return pkg as any
}
