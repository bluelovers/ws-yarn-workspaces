import { IOptionsPkgListable, normalizeListableRowExtra, wsPkgListable, wsPkgListableFromPaths } from 'ws-pkg-list';
import { IFindRootReturnType } from '@yarn-tool/find-root';
import { PackageJsonLoader } from 'npm-package-json-loader';
import { pkgExportsVerify } from '@yarn-tool/pkg-entry-util';
import { AggregateErrorExtra } from 'lazy-aggregate-error';
import Bluebird from 'bluebird';
import { createProgressEstimator } from '../util/cli-progress';
import { consoleLogger } from 'debug-color2/logger';
import { console } from 'debug-color2';
import { ProgressEstimator } from 'progress-estimator';
import { fillPkgHostedInfo, IFillPkgHostedInfoOptions } from '@yarn-tool/pkg-hosted-info';
import { ITSRequiredPick } from 'ts-type/lib/type/record';

export function _handler(cwd: string, ...argv: Parameters<IOptionsPkgListable["handler"]>)
{
	return {
		...normalizeListableRowExtra(argv[0], cwd),
		pkg: argv[1],
	}
}

export type IEntry = ReturnType<typeof _handler>

export function _runEachPackagesAsync(list: IEntry[],
	options: ITSRequiredPick<IFillPkgHostedInfoOptions, 'overwriteHostedGitInfo' | 'branch' | 'rootData' | 'hostedGitInfo'>,
)
{
	const {
		rootData,
		overwriteHostedGitInfo,
		hostedGitInfo,
		branch,
	} = options;

	let logger: ProgressEstimator;

	return Bluebird.resolve(list)
		.tap(() =>
		{
			logger = createProgressEstimator(rootData.root);

			consoleLogger.info(`auto check/fix packages`);
		})
		.mapSeries(async (row) =>
		{
			//console.dir(row);

			const err = new AggregateErrorExtra();

			const promiseLogger = logger((async () =>
			{

				const pkg = new PackageJsonLoader(row.manifestLocation);

				try
				{
					pkgExportsVerify(pkg.data);
				}
				catch (e)
				{
					err.push(e);
				}

				fillPkgHostedInfo(pkg.data, {
					targetDir: row.location,
					overwriteHostedGitInfo,
					hostedGitInfo,
					branch,
				});

				pkg.autofix();
				pkg.write();

			})().catch(e => err.push(e)), row.name)

			return promiseLogger
				.catch(e => err.push(e))
				.then(() =>
				{
					if (err.length)
					{
						console.error(err.toString());
					}
				})
		})
		;
}

export function _initPkgListableByRootData(rootData: Pick<IFindRootReturnType, 'root' | 'hasWorkspace'>)
{
	let cwd = rootData.root;

	if (rootData.hasWorkspace)
	{
		return wsPkgListable(cwd, {
			handler(...argv)
			{
				return _handler(cwd, ...argv)
			},
		})
	}

	return wsPkgListableFromPaths([
		cwd,
	], cwd, {
		handler(...argv)
		{
			return _handler(cwd, ...argv)
		},
	})
}
