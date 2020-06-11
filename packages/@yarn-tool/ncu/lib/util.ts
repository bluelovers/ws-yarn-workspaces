/**
 * Created by user on 2020/6/12.
 */

import { IVersionValue, EnumVersionValue, EnumVersionValue2 } from '@ts-type/package-dts/lib/package-json/types';
import { IVersionCacheMapKey, IVersionCacheMapValue, IPackageMap } from './types';
import { inspect } from "util";

export function isBadVersion(version: IVersionValue)
{
	let bool = false;
	switch (version)
	{
		case EnumVersionValue.minor:
		case EnumVersionValue.major:
		case EnumVersionValue.newest:
		case EnumVersionValue.latest:
		case EnumVersionValue.greatest:
		case EnumVersionValue2.any:
			bool = true;
			break;
		default:

			if (version == null)
			{
				bool = true;
			}

			break;
	}

	return bool;
}

export function keyObjectToPackageMap(obj: IVersionCacheMapKey[] | IVersionCacheMapValue[],
	useVarsionNew?: boolean,
): IPackageMap
{
	// @ts-ignore
	return obj.reduce(function (a: any, data)
	{
		if (useVarsionNew)
		{
			if (typeof data.version_new !== 'string')
			{
				return a;

				throw new TypeError(`not a IVersionCacheMapValue object, ${inspect(data)}`)
			}

			a[data.name] = data.version_new;
		}
		else
		{
			a[data.name] = data.version_old;
		}

		return a;
		// @ts-ignore
	}, {})
}
