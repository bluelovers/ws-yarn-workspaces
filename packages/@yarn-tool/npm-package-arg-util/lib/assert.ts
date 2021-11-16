import { IResult } from './types';

export function assertNpaResultHasName<T extends IResult>(result: T): asserts result is T & {
	name: string
}
{
	if (!result.name?.length)
	{
		throw new Error(`Invalid input: ${result.raw}`)
	}
}
