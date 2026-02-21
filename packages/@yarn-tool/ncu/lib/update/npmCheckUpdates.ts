/**
 * Core npm-check-updates wrapper function.
 * npm-check-updates 的核心封裝函數。
 *
 * 此模組提供主要功能：
 * - 檢查 package.json 中依賴套件的可用更新
 * - 比較當前版本與最新版本
 * - 支援 semver 版本範圍處理
 * - 整合版本快取機制
 *
 * @module update/npmCheckUpdates
 */

import { IOptionsNpmCheckUpdates, IDependency } from '../types';
import { npmCheckUpdatesOptions } from '../options';
import { run as _npmCheckUpdates } from 'npm-check-updates';
import Bluebird from 'bluebird';
import { IPackageJsonDependenciesField } from '@ts-type/package-dts/package-json';
import { allowUpdateVersion } from '../util';
import { queryVersionWithCache } from '@yarn-tool/pkg-version-query/lib/queryVersion';
import { mergeSimpleSemVer } from '@lazy-node/semver-simple-parse/lib/mergeSimpleSemVer';
import { parseSimpleSemVer } from '@lazy-node/semver-simple-parse/lib/parseSimpleSemVer';
import { stringifySemverFull } from '@lazy-node/semver-simple-parse/lib/stringifySimpleSemVer';
import { IWrapDedupeCache } from '@yarn-tool/yarnlock/lib/types';
import { ITSRequireAtLeastOne } from 'ts-type';
import { getCache } from '@yarn-tool/pkg-version-query';
import { toDependencyTable } from '@yarn-tool/table/lib/deps-table';
import { npa } from '@yarn-tool/npm-package-arg-util';

export function npmCheckUpdates<C extends IWrapDedupeCache>(cache: Partial<C>,
	ncuOptions: ITSRequireAtLeastOne<IOptionsNpmCheckUpdates, 'json_old' | 'packageData'>,
)
{
	//ncuOptions.silent = false;

	//ncuOptions.json = false;
	//ncuOptions.cli = true;

	//ncuOptions.args = [];

	//ncuOptions.loglevel = 'verbose';

	let json_changed = false;

	const current: IDependency = {};
	const list_updated: IDependency = {};

	return Bluebird
		.resolve()
		.then(async () => {

			ncuOptions = npmCheckUpdatesOptions(ncuOptions);

			ncuOptions.cwd = cache.cwd;

			ncuOptions.json_new = JSON.parse(ncuOptions.packageData);

			ncuOptions.list_updated = await _npmCheckUpdates(ncuOptions) as Record<string, string>;

			return [
				'dependencies',
				'devDependencies',
				'peerDependencies',
				'optionalDependencies',
			] as IPackageJsonDependenciesField[];
		})
		.each(async (key) =>
		{
			const deps = ncuOptions.json_new[key] ?? {};

			return Bluebird
				.resolve(Object.keys(deps))
				.each(async (name) =>
				{
					const version_new = ncuOptions.list_updated[name];
					const version_old = deps[name];

					if (version_new?.length)
					{
						if (version_old !== version_new && allowUpdateVersion(version_old))
						{
							list_updated[name] = version_new;
							current[name] = version_old;

							deps[name] = version_new;

							json_changed = true;
						}
					}
					else if (!/[\s|&]/.test(version_old))
					{
						let key = `${name}@${version_old}`

						let check = npa(key);
						let prefix = /^([\^~\s]+)/.exec(version_old)?.[1];

						if (prefix?.length && check.type === 'range')
						{
							let version_new = await queryVersionWithCache(name, version_old)
								.then(v => prefix + v)
								.catch(e => null)
							;

							if (version_new?.length && version_new !== version_old)
							{
								try
								{
									let { target } = mergeSimpleSemVer(parseSimpleSemVer(version_old), parseSimpleSemVer(version_new));

									let version = stringifySemverFull(target)

									if (version?.length > 0)
									{
										list_updated[name] = version;
										current[name] = version_old;

										deps[name] = version;

										json_changed = true;
									}
								}
								catch (err)
								{}
							}
						}
					}

				})
		}).then(async () => {

			await getCache().fsDump();

			ncuOptions.json_changed = json_changed;
			ncuOptions.list_updated = list_updated;
			ncuOptions.current = current;

			const table = toDependencyTable({
				from: ncuOptions.current,
				to: ncuOptions.list_updated,
			}).toString();

			table && console.log(`\n${table}\n`);

			return ncuOptions as IOptionsNpmCheckUpdates;
		})
	;
}
