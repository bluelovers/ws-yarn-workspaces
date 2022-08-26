import { IStaticFilesMapArrayEntry } from './types';
import { dirname, resolve } from 'path';
import { copySync, ensureDirSync, existsSync } from 'fs-extra';
import { default as __root } from '../__root';

export function copyStaticFilesEntry(entry: IStaticFilesMapArrayEntry<string>,
	cwd: string,
	staticRoot: string = __root,
	overwrite?: boolean,
)
{
	const [targetFile, staticFile, detectFile] = entry;

	if (detectFile?.length)
	{
		const fc = resolve(cwd, detectFile);

		if (existsSync(fc))
		{
			return;
		}
	}

	const fb = resolve(staticRoot, staticFile);

	if (!existsSync(fb))
	{
		throw new Error(`file not exists. ${fb}`)
	}

	const fa = resolve(cwd, targetFile);

	ensureDirSync(dirname(fa))
	copySync(fb, fa, {
		overwrite: overwrite || false,
		preserveTimestamps: true,
		errorOnExist: false,
	});

	return true;
}
