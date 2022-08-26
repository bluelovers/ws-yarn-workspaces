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
import { packageJsonDependenciesFields } from '@ts-type/package-dts/lib/package-json/types';
import { normalizeDepsValue } from '@yarn-tool/normalize-deps-value';
import { getRootCopyStaticFilesAuto } from '@yarn-tool/static-file/lib/root/getRootCopyStaticFiles';
import { copyStaticFiles } from '@yarn-tool/static-file';
import { defaultPkgScripts } from '@yarn-tool/pkg-entry-util/lib/preset/pkg-scripts';
import { pathIsSame } from 'path-is-same';

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
			console.dir(row);

			const err = new AggregateErrorExtra();

			const promiseLogger = logger((async () =>
			{

				const pkg = new PackageJsonLoader(row.manifestLocation);

				const file_map = getRootCopyStaticFilesAuto({
					...rootData,
					isRoot: false,
				});

				copyStaticFiles({
					cwd: row.location,
					file_map,
				});

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

				packageJsonDependenciesFields
					.forEach(field => {

						Object.keys(pkg.data[field] ?? {})
							.forEach(name => {
								const _value = normalizeDepsValue(pkg.data[field][name]);
								pkg.data[field][name] = _value;
							})
						;

					})
				;

				pkg.data.scripts = {
					...defaultPkgScripts(),
					...(pkg.data.scripts ?? {}),
				};

				if (pathIsSame(rootData.root, row.location))
				{
					if (pathIsSame(rootData.ws, row.location))
					{

					}
					else
					{

					}
				}
				else
				{

				}

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
						console.error(err);
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
