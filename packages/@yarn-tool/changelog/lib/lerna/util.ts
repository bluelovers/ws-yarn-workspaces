import {
	IOptionsWithType,
	IOptionsUpdateChangelog,
	IOptionsRecommendVersion,
	IOptionsBaseCore,
	IChangelogPreset, IOptionsBase,
} from '../types';
import { defaults } from 'lodash';
import { requireResolveExtra, requireResolveCore } from '@yarn-tool/require-resolve';
import { join } from 'path';

export function handleOptions<T extends IOptionsRecommendVersion | IOptionsUpdateChangelog>(options?: IOptionsWithType<T>): IOptionsWithType<T>
{
	const defaultChangelogPreset = '@bluelovers/conventional-changelog-bluelovers' as const;

	options = defaults(options ?? {} as null, <IOptionsWithType<IOptionsBase>>{
		type: 'independent',
		changelogPreset: void 0,
		tagPrefix: 'v',
	})

	if (typeof options.type !== 'string' || !options.type.length)
	{
		options.type = 'independent'
	}

	if (typeof options.tagPrefix !== 'string')
	{
		options.tagPrefix = 'v'
	}

	if (typeof options.changelogPreset !== 'string' || !options.changelogPreset.length || !Boolean(options.changelogPreset))
	{
		options.changelogPreset = void 0;
	}

	if (!options.changelogPreset || options.changelogPreset === defaultChangelogPreset)
	{
		options.changelogPreset = requireResolveExtra(defaultChangelogPreset, {
			includeGlobal: true,
			includeCurrentDirectory: true,
			paths: [
				join(__dirname, '../..'),
			],
		}).result ?? options.changelogPreset;
	}

	options.changelogPreset ??= 'conventional-changelog-angular';

	return options
}

function tryRequire(name: IChangelogPreset)
{
	try
	{
		return requireResolveCore(name, {
			includeGlobal: true,
			includeCurrentDirectory: true,
		})
	}
	catch (err)
	{
		if (err.code !== "MODULE_NOT_FOUND")
		{
			throw new err
		}
	}
}
