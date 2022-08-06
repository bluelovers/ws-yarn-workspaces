import { EnumDetectYarnLock } from '@yarn-tool/yarnlock-types';

type IValues = (keyof typeof EnumDetectYarnLock | EnumDetectYarnLock);

function _handleFilter(values: IValues[])
{
	return (values ?? []).map(v =>
	{
		return typeof v === 'number' ? `v${v}` : v
	}) as (keyof typeof EnumDetectYarnLock)[];
}

export function _forEachVersionTags(options?: {
	only?: IValues[],
	not?: IValues[],
})
{
	options ??= {};

	let list = (<(keyof typeof EnumDetectYarnLock)[]>[
		'v1',
		'v2',
		'v3',
	]);

	if (options.only?.length > 0 || options.not?.length > 0)
	{
		options.only = _handleFilter(options.only);
		options.not = _handleFilter(options.not);

		list = list.filter(v =>
		{
			let bool = true;

			if (options.only.length)
			{
				bool = options.only.includes(v)
			}

			if (bool && options.not.length)
			{
				bool = !options.not.includes(v)
			}

			return bool
		})
	}

	return list
}
