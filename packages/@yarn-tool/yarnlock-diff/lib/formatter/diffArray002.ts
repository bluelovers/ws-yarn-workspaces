import { DiffArray, EnumKinds } from '@bluelovers/deep-diff';
import { _formatVersion } from './formatVersion';
import { IChalk } from 'debug-color2'

export function _diffArray(array: DiffArray<{}, {}>, chalk: IChalk)
{
	const item = array.item;
	switch (item.kind)
	{
		case EnumKinds.DiffNew:
			return [`[...]`, `[..., ${chalk.green(_formatVersion(item.rhs))}]`];
		case EnumKinds.DiffDeleted:
			return [`[..., ${chalk.red(_formatVersion(item.lhs))}]`, `[...]`];
		case EnumKinds.DiffEdit:
			return [
				`[..., ${chalk.yellow(_formatVersion(item.lhs))}]`,
				`[..., ${chalk.yellow(_formatVersion(item.rhs))}]`,
			];
		default:
			return [`[...]`, `[...]`];
	}
}
