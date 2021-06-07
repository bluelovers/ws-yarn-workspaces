import { DiffArray, EnumKinds } from '@bluelovers/deep-diff';
import { _formatVersion } from './formatVersion';

/**
 * @deprecated
 */
export function _diffArray(array: DiffArray<{}, {}>): [string, string]
{
	const item = array.item;
	switch (item.kind)
	{
		case EnumKinds.DiffNew:
			return [`[...]`, `[..., ${_formatVersion(item.rhs)}]`];
		case EnumKinds.DiffDeleted:
			return [`[..., ${_formatVersion(item.lhs)}]`, `[...]`];
		case EnumKinds.DiffEdit:
			return [
				`[...], ${_formatVersion(item.lhs)}]`,
				`[..., ${_formatVersion(item.lhs)}]`,
			];
		default:
			return [`[...]`, `[...]`];
	}
}
