import { IPackageJson } from '@ts-type/package-dts/package-json';
import sortObjectKeys from 'sort-object-keys2';
import isPlainObject from 'is-plain-obj';

export function sortPackageJsonExports(exports: IPackageJson["exports"])
{
	if (isPlainObject(exports))
	{
		Object.keys(exports)
			.forEach(key =>
			{

				let value = exports[key];

				if ((key === '.' || key.startsWith('./')) && isPlainObject(value))
				{
					exports[key] = sortObjectKeys(value, {
						keys: [
							'types',
							'import',
							'require',
						],
						useSource: true,
					});
				}

			})
	}

	return exports
}
