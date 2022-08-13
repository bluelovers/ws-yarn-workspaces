import { buildRangeSet } from './buildRangeSet';

export function stringifyRangeSet(rangeSet: ReturnType<typeof buildRangeSet>)
{
	return rangeSet.flat().join(' ')
}
