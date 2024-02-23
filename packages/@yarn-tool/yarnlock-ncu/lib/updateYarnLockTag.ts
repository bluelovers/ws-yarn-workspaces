import { fromContent } from '@yarn-tool/yarnlock-entries/lib/fromContent';
import { queryVersionWithCache } from '@yarn-tool/pkg-version-query/lib/queryVersion';
import { gt } from 'semver';
import { IYarnLockUpdateReport, IYarnLockUpdate } from './types';
import { npa } from '@yarn-tool/npm-package-arg-util';
import { AliasResult } from 'npm-package-arg';
import { EnumSemverVersion } from '@lazy-node/semver-ampersand/lib/const';
import { parseSimpleSemVerRange } from '@lazy-node/semver-simple-parse/lib/parseSimpleSemVerRange';

export async function updateYarnLockTag(yarnlock_old: Buffer | string)
{
	const obj = fromContent(yarnlock_old);

	yarnlock_old = obj.stringify();

	let report: IYarnLockUpdateReport = {};

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
		else if (data.value.type === 'alias')
		{
			let npaResult = npa<AliasResult>(data.key);

//			console.dir({
//				data,
//				npaResult,
//			})

			if (npaResult.rawSpec.startsWith('npm:'))
			{
				let name = npaResult.subSpec.name;
				let version = data.value.version;
				let semver: string;
				let version_new: string;

				if (npaResult.subSpec.type === 'range')
				{
					if (npaResult.subSpec.fetchSpec === EnumSemverVersion.ANY || npaResult.subSpec.fetchSpec === EnumSemverVersion.STAR)
					{
						semver = '>' + version;
					}
					else if (parseSimpleSemVerRange(npaResult.subSpec.fetchSpec).length > 1)
					{
						semver = npaResult.subSpec.fetchSpec;
					}

					if (typeof semver === 'string')
					{
						version_new = await queryVersionWithCache(name, semver);
					}
				}
				else if (npaResult.subSpec.type === 'tag')
				{
					version_new = await queryVersionWithCache(name, npaResult.subSpec.fetchSpec);
				}

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
		}

	});

	let yarnlock_new = obj.stringify();

	return {
		yarnlock_old,
		yarnlock_new,
		yarnlock_changed: yarnlock_old !== yarnlock_new,
		report,
	} as IYarnLockUpdate
}
