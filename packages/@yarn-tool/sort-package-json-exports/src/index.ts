import { IPackageJson } from '@ts-type/package-dts/package-json';
import { sortObjectKeys } from 'sort-object-keys2';
import isPlainObject from 'is-plain-obj';
import {
	IPackageExportsEntryObject, IPackageExportsValue,
} from '@ts-type/package-dts/lib/package-json/exports';

export function isPackageJsonExportsEntryObject<T extends IPackageExportsValue, O extends IPackageExportsEntryObject = IPackageExportsEntryObject>(exports: T): exports is Extract<T, O>
{
	return isPlainObject(exports)
}

export interface IOptions
{
	rootOrder?: readonly string[];
	entryOrder?: readonly string[];
}

export function _handleOptions(options?: IOptions)
{
	const rootOrder = [
		'types',
		'require',
		'import',
		'node',
		'node-addons',
	];

	const entryOrder = [
		...rootOrder,
		'default',
		'.',
		'./',
		'./package.json',
	];

	if (options)
	{
		if (options.rootOrder?.length)
		{
			rootOrder.splice(0, 0, ...options.rootOrder);
		}
		if (options.entryOrder?.length)
		{
			entryOrder.splice(0, 0, ...options.entryOrder);
		}
	}

	return {
		rootOrder,
		entryOrder,
	}
}

export function sortPackageJsonExports(exports: IPackageJson["exports"], options?: IOptions)
{
	if (isPackageJsonExportsEntryObject(exports))
	{
		const { rootOrder, entryOrder } = _handleOptions(options);

		sortObjectKeys(exports, {
			keys: rootOrder,
			useSource: true,
		});

		Object.keys(exports)
			.forEach(key =>
			{
				const value = exports[key];

				if (isPackageJsonExportsEntryObject(value))
				{
					exports[key] = sortObjectKeys(value, {
						keys: entryOrder,
						useSource: true,
					});
				}
			})
	}

	return exports
}

export default sortPackageJsonExports
