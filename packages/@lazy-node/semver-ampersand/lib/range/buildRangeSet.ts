import { IOptions } from '../types';
import { splitDoubleVerticalBar, splitSpace } from '../util/split';
import { array_unique_overwrite } from 'array-hyper-unique';
import { handleAmpersandAndSpaces } from '../handleAmpersandAndSpaces';
import { normalizeRangeInput } from './normalizeRangeInput';

export function buildRangeSet(range: string, options: IOptions = {})
{
	range = handleAmpersandAndSpaces(range, options);

	let rangeSet = splitDoubleVerticalBar(range)
		// map the range to a 2d array of comparators
		.map(range =>
		{
			range = normalizeRangeInput(range, options);

			return splitSpace(range)
		})
	;

	rangeSet = array_unique_overwrite(rangeSet)

	return rangeSet
}
