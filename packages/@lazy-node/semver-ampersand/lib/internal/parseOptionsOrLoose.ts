import { IOptions, IOptionsOrLoose } from '../types';
import { isPlainObject } from '../util/index';
import { fixBooleanProperty, opts } from '../util/fixBooleanProperty';

export function parseOptionsOrLoose<T extends IOptions>(options: IOptionsOrLoose<T>): T
{
	if (options === false)
	{
		options = {
			loose: !!options,
		} as T;
	}
	else if (!options || typeof options === 'object' && !isPlainObject(options))
	{
		options = {} as T;
	}
	else if (typeof options !== 'object' || !isPlainObject(options))
	{
		options = {
			loose: !!options,
		} as T;
	}
	else
	{
		options = fixBooleanProperty(options, opts)
	}

	return options
}
