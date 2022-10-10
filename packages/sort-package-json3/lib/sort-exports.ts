import { IPackageJson } from '@ts-type/package-dts/package-json';
import { sortObjectKeys } from 'sort-object-keys2';
import isPlainObject from 'is-plain-obj';
import {
	IPackageExportsEntryObject, IPackageExportsValue,
	IPackageJsonExportsEntryObjectRoot,
} from '@ts-type/package-dts/lib/package-json/exports';

export function isPackageJsonExportsEntryObject<T extends IPackageExportsValue, O extends IPackageExportsEntryObject = IPackageExportsEntryObject>(exports: T): exports is Extract<T, O>
{
	return isPlainObject(exports)
}

export function sortPackageJsonExports(exports: IPackageJson["exports"])
{
	if (isPackageJsonExportsEntryObject(exports))
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

				if ((key === '.' || key.startsWith('./')) && isPackageJsonExportsEntryObject(value))
				{
					exports[key] = sortObjectKeys(value, {
						keys: _order,
						useSource: true,
					});
				}

			})
	}

	return exports
}
