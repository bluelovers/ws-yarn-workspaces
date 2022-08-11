import stripAnsi from 'strip-ansi';

export function stripAnsiValues<T extends string[]>(input: Record<any, T>, overwrite?: boolean)
{
	return Object.values(input)
		.map(arr => {
			if (overwrite)
			{
				arr.forEach((value, i) => {
					arr[i] = stripAnsi(value);
				})
			}
			else
			{
				arr = arr.map(stripAnsi) as T;
			}
			return arr
		})
	;
}
