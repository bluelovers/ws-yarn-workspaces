import { DiffArray } from 'deep-diff';
import { _formatVersion } from './formatVersion';
import { IChalk } from 'debug-color2/index'

export function _diffArray(array: DiffArray<{}, {}>, chalk: IChalk)
{
	const item = array.item;
	switch (item.kind)
	{
		case "N":
			return [`[...]`, `[..., ${chalk.green(_formatVersion(item.rhs))}]`];
		case "D":
			return [`[..., ${chalk.red(_formatVersion(item.lhs))}]`, `[...]`];
		case "E":
			return [
				`[..., ${chalk.yellow(_formatVersion(item.lhs))}]`,
				`[..., ${chalk.yellow(_formatVersion(item.lhs))}]`,
			];
		default:
			return [`[...]`, `[...]`];
	}
}
