import { ITSArrayListMaybeReadonly } from 'ts-type/lib/type/base';

export const opts = ['includePrerelease', 'loose', 'rtl'] as const

export function fixBooleanProperty<T extends Record<any, any>>(options: T,
	fields: ITSArrayListMaybeReadonly<string> = opts,
	mode?: boolean
)
{
	fields.forEach(k =>
	{
		if (typeof options[k] !== 'undefined' || mode === true)
		{
			// @ts-ignore
			options[k] = !!options[k];
		}
	});

	return options
}
