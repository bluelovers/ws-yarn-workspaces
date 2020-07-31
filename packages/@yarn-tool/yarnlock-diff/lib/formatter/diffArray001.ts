import { DiffArray } from 'deep-diff';
import { _formatVersion } from './formatVersion';

/**
 * @deprecated
 */
export function _diffArray(array: DiffArray<{}, {}>): [string, string]
{
	const item = array.item;
	switch (item.kind)
	{
		case "N":
			return [`[...]`, `[..., ${_formatVersion(item.rhs)}]`];
		case "D":
			return [`[..., ${_formatVersion(item.lhs)}]`, `[...]`];
		case "E":
			return [
				`[...], ${_formatVersion(item.lhs)}]`,
				`[..., ${_formatVersion(item.lhs)}]`,
			];
		default:
			return [`[...]`, `[...]`];
	}
}
