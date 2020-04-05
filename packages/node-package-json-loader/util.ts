import fs = require('fs-extra');
import path = require('path');

export function fixBinPath(bin: string, root: string)
{
	if (
		!fs.existsSync(path.join(root, bin))
		&& fs.existsSync(path.join(root, 'bin', bin))
	)
	{
		return path.posix.join('.', 'bin', bin);
	}

	return null;
}
