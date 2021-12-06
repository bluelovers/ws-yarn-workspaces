import { array_unique_overwrite } from 'array-hyper-unique';

export function arrayAdd(scope: string, value?: string[])
{
	value ??= [];

	if (!Array.isArray(value))
	{
		throw new Error(`Only support Array but ${value}`)
	}

	let changed = false;

	if (!value.includes(scope))
	{
		value.push(scope);

		array_unique_overwrite(value);

		changed = true;
	}

	return {
		changed,
		value,
	}
}

export function arrayRemove(scope: string, value: string[])
{
	let changed = false;

	if (value && value.includes(scope))
	{
		let i = value.indexOf(scope);

		value.splice(i, 1);

		changed = true;
	}

	return {
		changed,
		value,
	}
}
