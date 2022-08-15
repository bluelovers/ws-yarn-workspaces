import { buildRangeSet } from './buildRangeSet';
import { separatorDoubleVerticalBar } from '../const';

export function stringifyRangeSet(rangeSet: ReturnType<typeof buildRangeSet>)
{
	return rangeSet
		.map(a => a.join(' '))
		.join(separatorDoubleVerticalBar)
}
