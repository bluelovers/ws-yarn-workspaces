import { existsSync } from 'fs-extra';
import { join, posix } from 'path';

export function fixBinPath(bin: string, root: string)
{
	if (
		!existsSync(join(root, bin))
		&& existsSync(join(root, 'bin', bin))
	)
	{
		return posix.join('.', 'bin', bin);
	}

	return null;
}
