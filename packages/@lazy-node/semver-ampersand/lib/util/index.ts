import { reAmpersandAndSpaces } from '../const';

export function hasAmpersandAndSpaces(input: string)
{
	return reAmpersandAndSpaces.test(input)
}

