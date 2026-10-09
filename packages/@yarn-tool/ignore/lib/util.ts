import { isArray } from '@ts-type/is-array';
import { ITSArrayListMaybeReadonly, ITSValueOrArrayMaybeReadonly } from 'ts-type';

export function _readonlyArrayToMutable<T>(array: ITSArrayListMaybeReadonly<T> | Iterable<T>)
{
	if (typeof (array as string[]).splice !== 'function')
	{
		array = [...array];
	}
	return array as T[];
}

export function _handleValueOrArrayCore<T extends ITSArrayListMaybeReadonly<string>>(patterns: T |
	string | Iterable<string>)
{
	if ((patterns as any).length || typeof patterns !== 'string' && (patterns as Iterable<string>)[Symbol.iterator])
	{
		if (!isArray(patterns))
		{
			if (typeof patterns === 'string')
			{
				patterns = [patterns] as string[];
			}
			else
			{
				patterns = [...patterns];
			}
		}

		return patterns as T;
	}

	return [] as T;
}

export function _handleValueOrArrayToMutable(patterns: ITSValueOrArrayMaybeReadonly<string> | Iterable<string>): string[]
{
	return _readonlyArrayToMutable(_handleValueOrArrayCore(patterns));
}

