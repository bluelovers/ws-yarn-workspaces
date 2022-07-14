import { array_unique_overwrite } from 'array-hyper-unique';
import { packageNameToTypes } from '@yarn-tool/npm-package-arg-util/lib/packageNameToTypes';
import { generatePackageArg } from '@yarn-tool/npm-package-arg-util/lib/generatePackageArg';

export function listToTypes(input: string[], includeVersion?: boolean)
{
	return array_unique_overwrite(input.reduce(function (a, b)
	{
		let result = packageNameToTypes(b);

		a.push(generatePackageArg(result, includeVersion));

		return a;
	}, [] as string[]));
}

export default listToTypes
