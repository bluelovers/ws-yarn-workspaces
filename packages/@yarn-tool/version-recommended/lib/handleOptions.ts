import { INextVersionRecommendedOptions, releaseTypes } from './types';

export function handleOptions(options?: INextVersionRecommendedOptions)
{
	options = {
		...options,
	}

	let bump = options.bump;

	if (!bump)
	{
		for (let type of releaseTypes)
		{
			if (options[type] === true)
			{
				bump = type
				break;
			}
		}
	}

	/*
	for (let type of releaseTypes)
	{
		delete options[type]
	}
	 */

	return options
}

