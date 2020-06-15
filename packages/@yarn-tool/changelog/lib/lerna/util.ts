import {
	IOptionsWithType,
	IOptionsUpdateChangelog,
	IOptionsRecommendVersion,
	IOptionsBaseCore,
	IChangelogPreset,
} from '../types';
import { defaults } from 'lodash';

export function handleOptions<T extends IOptionsRecommendVersion | IOptionsUpdateChangelog>(options?: IOptionsWithType<T>): IOptionsWithType<T>
{
	options = defaults(options ?? {} as any, {
		type: 'independent',
		changelogPreset: '@bluelovers/conventional-changelog-bluelovers',
		tagPrefix: 'v',
	})

	if (!options.changelogPreset)
	{
		options.changelogPreset = tryRequire('@bluelovers/conventional-changelog-bluelovers') ? '@bluelovers/conventional-changelog-bluelovers' : 'conventional-changelog-angular';
	}

	return options
}

function tryRequire(name: IChangelogPreset)
{
	try
	{
		return require.resolve(name)
	}
	catch (err)
	{
		if (err.code !== "MODULE_NOT_FOUND")
		{
			throw new err
		}
	}
}
