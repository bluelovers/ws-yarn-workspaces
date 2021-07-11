import npa from '@yarn-tool/npm-package-arg-util';
import { IResult } from '@yarn-tool/npm-package-arg-util/lib/types';
import { isRegistryResult } from '@yarn-tool/npm-package-arg-util/lib/detect';
import parseSimpleSemVerRange from '@lazy-node/semver-simple-parse/lib/parseSimpleSemVerRange';
import { isSimpleSemVerObjectLike } from '@lazy-node/semver-simple-parse/lib/checker';

export function isUpdateAbleVersionByNpmPackageArgResult<T extends IResult>(npaResult: T)
{
	if (isRegistryResult(npaResult) && npaResult.type !== 'tag')
	{
		return isUpdateAbleVersion(npaResult.fetchSpec)
	}
}

export function isUpdateAbleVersion(version: string)
{
	const list = parseSimpleSemVerRange(version);

	if (list.length === 1)
	{
		let semver = list[0];

		if (isSimpleSemVerObjectLike(semver))
		{
			return semver
		}
	}
}

export function handleSemverForDependencies(packageName: string)
{
	const result = npa(packageName);

	return isUpdateAbleVersionByNpmPackageArgResult(result)
}
