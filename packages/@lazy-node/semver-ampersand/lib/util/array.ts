
export function array_sub_map<U, T>(listSet: T[][], callbackFn: (value: T, index: number, array: T[]) => U, thisArg?: any)
{
	return listSet
		.map((list) => {
			return list.map(callbackFn, thisArg)
		})
	;
}
