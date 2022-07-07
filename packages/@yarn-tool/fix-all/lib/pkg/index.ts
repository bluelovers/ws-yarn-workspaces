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
import { sortPackageJson } from 'sort-package-json3';
import { fixPkgDepsVersionsCore, ICache, ICacheInput } from '@yarn-tool/fix-ws-versions';

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
	let cache: ICacheInput<IEntry> = {} as any;

	return Bluebird.resolve(list)
		.tap((listable) =>
		{
			logger = createProgressEstimator(rootData.root);

			consoleLogger.info(`auto check/fix packages`);

			cache.listable = listable;

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

				fixPkgDepsVersionsCore(pkg.data, cache);

				pkg.data = sortPackageJson(pkg.data);

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
