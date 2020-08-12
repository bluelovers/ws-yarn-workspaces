import { fromContent } from '@yarn-tool/yarnlock-entries/lib/fromContent';
import { queryVersionWithCache } from '@yarn-tool/pkg-version-query/lib/queryVersion';
import { gt } from 'semver';

export interface IReport
{
	removed?: Record<string, {
		from: string,
		to: string,
	}>
}

export async function updateYarnLockTag(yarnlock_old: Buffer | string)
{
	const obj = fromContent(yarnlock_old);

	yarnlock_old = obj.stringify();

	let report: IReport = {};

	await obj.mapAsync(async (data, key) => {

		if (data.value.type === 'tag')
		{
			let { semver, version, name } = data.value;

			let version_new = await queryVersionWithCache(name, semver);

			if (version_new?.length && version_new !== version && gt(version_new, version))
			{
				obj.del(key);

				report.removed ??= {};

				report.removed[key] = {
					from: version,
					to: version_new,
				};
			}

		}

	});

	let yarnlock_new = obj.stringify();

	return {
		yarnlock_old,
		yarnlock_new,
		yarnlock_changed: yarnlock_old !== yarnlock_new,
		report,
	}
}
