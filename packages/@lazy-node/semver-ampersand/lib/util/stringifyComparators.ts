/**
 * Created by user on 2021/6/26.
 */
import Comparator from 'semver/classes/comparator';
import { ITSArrayListMaybeReadonly } from 'ts-type';
import { separatorDoubleVerticalBar } from '../const';

export function stringifyComparators(comparators: ITSArrayListMaybeReadonly<Comparator>)
{
	return comparators.join(' ')
}

export function stringifyComparatorsSet(comparators: ITSArrayListMaybeReadonly<ITSArrayListMaybeReadonly<Comparator>>)
{
	return comparators
		.map(stringifyComparators)
		.join(separatorDoubleVerticalBar)
	;
}
