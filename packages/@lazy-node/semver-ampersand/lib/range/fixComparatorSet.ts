import { IComparatorArrayInput, IComparatorSetInput } from '../types';
import { isAny, isNullSet } from '../comparator/detect';

export function includeAny(comparatorsArray: IComparatorArrayInput)
{
	return comparatorsArray.find(c => isAny(c))
}

/**
 * if we have any that are `*`, then the range is just `*`
 */
export function optimizeComparatorSetAny(comparatorsSet: IComparatorSetInput, unsafeOptimize?: boolean)
{
	unsafeOptimize = !!unsafeOptimize;

	for (const ca of comparatorsSet)
	{
		if (unsafeOptimize === true)
		{
			let cc = includeAny(ca);

			if (cc)
			{
				comparatorsSet = [[cc]];
				break;
			}
		}

		if (ca.length === 1 && isAny(ca[0]))
		{
			comparatorsSet = [ca];
			break;
		}
	}

	return comparatorsSet
}

export function filterRemoveNullSet(comparatorsSet: IComparatorSetInput, unsafeOptimize?: boolean)
{
	if (unsafeOptimize)
	{
		return comparatorsSet.filter(ca => !ca.some(isNullSet))
	}

	return comparatorsSet.filter(c => !isNullSet(c[0]))
}

export function fixComparatorSet(comparatorsSet: IComparatorSetInput, unsafeOptimize?: boolean)
{
	unsafeOptimize = !!unsafeOptimize;

	// if we have any that are not the null set, throw out null sets.
	if (comparatorsSet.length > 1)
	{
		// keep the first one, in case they're all null sets
		const first = comparatorsSet[0];
		comparatorsSet = filterRemoveNullSet(comparatorsSet, unsafeOptimize);

		if (comparatorsSet.length === 0)
		{
			comparatorsSet = [first];
		}
		else if (comparatorsSet.length > 1)
		{
			comparatorsSet = optimizeComparatorSetAny(comparatorsSet, unsafeOptimize);
		}
	}

	comparatorsSet = comparatorsSet.filter(ca => ca.length);

	return comparatorsSet
}
