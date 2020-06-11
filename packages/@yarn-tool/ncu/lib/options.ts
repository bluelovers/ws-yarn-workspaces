/**
 * Created by user on 2020/6/12.
 */

import { IOptionsNpmCheckUpdates } from './types';

export function npmCheckUpdatesOptions(ncuOptions: Partial<IOptionsNpmCheckUpdates> | IOptionsNpmCheckUpdates): IOptionsNpmCheckUpdates
{
	ncuOptions = {
		...ncuOptions,
	};

	delete ncuOptions.upgrade;
	// @ts-ignore
	delete ncuOptions.global;

	ncuOptions.packageManager = 'npm';

	if (ncuOptions.json_old)
	{
		ncuOptions.packageData = JSON.stringify(ncuOptions.json_old);
	}

	// @ts-ignore
	ncuOptions.jsonUpgraded = true;

	return ncuOptions as IOptionsNpmCheckUpdates
}
