import { reAmpersandAndSpaces } from '../const';

export function hasAmpersandAndSpaces(input: string)
{
	return reAmpersandAndSpaces.test(input)
}

export function isPlainObject(value): value is object
{
	if (Object.prototype.toString.call(value) !== '[object Object]')
	{
		return false;
	}

	const prototype = Object.getPrototypeOf(value);
	return prototype === null || prototype === Object.prototype;
}
