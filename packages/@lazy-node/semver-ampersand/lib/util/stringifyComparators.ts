
import { separatorDoubleVerticalBar } from '../const';
import { IComparatorSetInput, IComparatorArrayInput } from '../types';

/**
 * 把單一比較器陣列組成字串（以空白分隔）
 * Join one comparator array into a string (space-separated)
 *
 * @param comparatorsArray - 比較器陣列 / Comparator array
 * @returns 比較器字串 / Comparator string
 */
export function stringifyComparators(comparatorsArray: IComparatorArrayInput)
{
	return comparatorsArray.join(' ')
}

/**
 * 把整個比較器集合組成範圍字串
 * Join a whole comparator set into a range string
 *
 * 外層以 ` || ` 分隔（含前後空白），讓輸出可直接再喂回解析器。
 * Groups are joined with ` || ` (including surrounding spaces) so the output
 * can be fed straight back into the parser.
 *
 * @param comparatorsSet - 比較器集合 / Comparator set
 * @returns 範圍字串 / Range string
 */
export function stringifyComparatorsSet(comparatorsSet: IComparatorSetInput)
{
	return comparatorsSet
		.map(stringifyComparators)
		.join(separatorDoubleVerticalBar)
	;
}
