import { IOptionsPkgListable, normalizeListableRowExtra, wsPkgListable, wsPkgListableFromPaths } from 'ws-pkg-list';
import { IFindRootReturnType, newFakeRootData } from '@yarn-tool/find-root';
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
import { defaultPkgScripts } from '@yarn-tool/pkg-entry-util/lib/preset/scripts/pkg-scripts';
import { pathIsSame } from 'path-is-same';
import { isDummyEchoMaybeOrEmpty } from '@yarn-tool/pkg-entry-util/lib/util/scripts/dummy';
import { EnumScriptsEntry } from '@yarn-tool/pkg-entry-util/lib/field/scripts';
import { isTsdxPackage } from '@yarn-tool/setup-module-env/lib/preset/tsdx/is-tsdx';
import { fixTsdxPackage } from '@yarn-tool/setup-module-env/lib/preset/tsdx/fix';
import { _resetStaticFiles } from '../file/reset';
import { INpmAutoFixAll } from '../../index';

export function _handler(cwd: string, ...argv: Parameters<IOptionsPkgListable["handler"]>)
{
	return {
		...normalizeListableRowExtra(argv[0], cwd),
		pkg: argv[1],
	}
}

export type IEntry = ReturnType<typeof _handler>

export interface IOptionsRunEachPackages extends ITSRequiredPick<IFillPkgHostedInfoOptions & INpmAutoFixAll, 'overwriteHostedGitInfo' | 'branch' | 'rootData' | 'hostedGitInfo' | 'resetStaticFiles'>
{

}

export function _runEachPackagesAsync(list: IEntry[],
	options: IOptionsRunEachPackages,
)
{
	const {
		rootData,
		overwriteHostedGitInfo,
		hostedGitInfo,
		branch,
		resetStaticFiles,
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
				const _rootDataFake = newFakeRootData(rootData, {
					pkg: row.location,
				});

				const { isRoot, isWorkspace } = _rootDataFake;

				const pkg = new PackageJsonLoader(row.manifestLocation);

				if (resetStaticFiles)
				{
					_resetStaticFiles(_rootDataFake.pkg, {
						rootData: _rootDataFake,
					});
				}

				const file_map = getRootCopyStaticFilesAuto(_rootDataFake);

				copyStaticFiles({
					cwd: row.location,
					file_map,
				});

				try
				{
					pkgExportsVerify(pkg.data, {
						cwd: row.location,
					});
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

				if (isTsdxPackage(pkg.data))
				{
					fixTsdxPackage(pkg.data, {
						rootData: _rootDataFake,
					});
				}

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

				if (isRoot)
				{
					if (isWorkspace)
					{

					}
					else
					{

					}
				}
				else
				{
					if (!pkg.data.scripts['_preversion']?.length && isDummyEchoMaybeOrEmpty(pkg.data.scripts.preversion))
					{
						pkg.data.scripts.preversion = EnumScriptsEntry.preversion;
					}
				}

				pkg.data = sortPackageJson(pkg.data);

				pkg.autofix();
				pkg.write();

			})().catch(e => {
				e.row = row;
				err.push(e);
			}), row.name)

			return promiseLogger
				.catch(e => {
					e.row = row;
					err.push(e);
				})
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
