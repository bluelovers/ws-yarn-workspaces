/**
 * Created by user on 2020/6/15.
 */
import { IOptionsPackageTagInput, IOptionsPackageTag, IPackageJsonWithVersion } from './types';

export function handleOptions(options: IOptionsPackageTagInput)
{
	let version = options.version ?? options.pkg.version;
	let cwd = options.cwd || process.cwd();

	if (!version?.length)
	{
		throw new Error(`tag version must be provided`)
	}

	let tag = version;
	let tagPrefix = options.tagPrefix ?? '';

	let name = options.name ?? options.pkg.name;

	if (!options.excludeName && !name?.length)
	{
		throw new Error(`pkg name must be provided`)
	}

	return {
		...(options as IOptionsPackageTag),
		cwd,
		name,
		version,
		tagPrefix,
	}
}

export function formatPackageTag(options: IOptionsPackageTagInput)
{
	let tag = options.version ?? options.pkg.version;

	if (!tag?.length)
	{
		throw new Error(`tag version must be provided`)
	}

	if (options.tagPrefix?.length > 0)
	{
		tag = `${options.tagPrefix}${tag}`
	}

	if (!options.excludeName)
	{
		let name = options.name ?? options.pkg.name;

		if (!name?.length)
		{
			throw new Error(`pkg name must be provided`)
		}

		tag = `${name}@${tag}`
	}

	return tag
}
