import { IPackageJson } from '@ts-type/package-dts/package-json';
import { sortObjectKeys } from 'sort-object-keys2';
import isPlainObject from 'is-plain-obj';

export function sortPackageJsonExports(exports: IPackageJson["exports"])
{
	if (isPlainObject(exports))
	{
		const _order = [
			'types',
			'require',
			'import',
			'node',
			'node-addons',
		];

		const _order_root = [
			..._order,
			'default',
			'.',
			'./',
		];

		sortObjectKeys(exports, {
			keys: _order_root,
			useSource: true,
		});

		Object.keys(exports)
			.forEach(key =>
			{

				let value = exports[key];

				if ((key === '.' || key.startsWith('./')) && isPlainObject(value))
				{
					exports[key] = sortObjectKeys(value, {
						keys: [
							..._order,
						],
						useSource: true,
					});
				}

			})
	}

	return exports
}
