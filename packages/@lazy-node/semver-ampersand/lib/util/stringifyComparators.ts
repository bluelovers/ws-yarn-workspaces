
import { separatorDoubleVerticalBar } from '../const';
import { IComparatorSetInput, IComparatorArrayInput } from '../types';

export function stringifyComparators(comparatorsArray: IComparatorArrayInput)
{
	return comparatorsArray.join(' ')
}

export function stringifyComparatorsSet(comparatorsSet: IComparatorSetInput)
{
	return comparatorsSet
		.map(stringifyComparators)
		.join(separatorDoubleVerticalBar)
	;
}
